import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Consultant} from '../models/consultant';
import {firstValueFrom, Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Consultation} from '../models/consultation';
import {
  startOfDay,
  addHours,
} from 'date-fns';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultantsService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  getConsultants(): Observable<Consultant[]> {
    return this.firestore.collection<Consultant>('consultants').valueChanges({idField: 'id'});
  }

  async getConsultantName(consultantId: string) {
    console.log(consultantId)
    const docRef = this.firestore
      .collection('consultants')
      .doc(consultantId)
      .valueChanges();
    const doc = await firstValueFrom(docRef);
    console.log(doc)
    // @ts-ignore
    return doc?.name || 'Unknown'; // Return the name as a string
  }

  getConsultations(consultantId: string) {
    return this.firestore
      .collection('consultants')
      .doc(consultantId)
      .collection<Consultation>('consultations')
      .valueChanges({idField: 'id'});
  }

  getConsultant(consultantId: string) {
    return this.firestore
      .collection('consultants')
      .doc(consultantId)
      .valueChanges({idField: 'id'});
  }

  async addAbsence(date: Date) {
    date = addHours(startOfDay(date), 1);
    const userId = this.authService.userId.value;
    if (userId !== null) {
      const absence = {
        date: date.toISOString(),
      }
      await this.firestore
        .collection('consultants')
        .doc(userId)
        .collection('absences')
        .add(absence);
    }


    const batchSize = 500;
    let batchCount = 0;
    let batch = this.firestore.firestore.batch(); // Native batch object

    // Query all patients
    const patientsSnapshot = await this.firestore.collection('patients').get().toPromise();

    // Loop through all patients
    // @ts-ignore
    for (const patientDoc of patientsSnapshot.docs) {
      // Get the patient's reservations for the given day
      const reservationsRef = this.firestore
        .collection('patients')
        .doc(patientDoc.id)
        .collection('reservations', (ref) => ref.where('_date', '==', date.toISOString()));

      const reservationsSnapshot = await reservationsRef.get().toPromise();

      // Loop through all reservations and update the desired field
      // @ts-ignore
      for (const reservationDoc of reservationsSnapshot.docs) {
        // Get the reference to the reservation document
        const reservationRef = this.firestore
          .collection('patients')
          .doc(patientDoc.id)
          .collection('reservations')
          .doc(reservationDoc.id)
          .ref; // Access the native Firestore reference

        // Add the update operation to the batch
        batch.update(reservationRef, {canceled: true});
        batchCount++;

        // Commit the batch after 500 updates
        if (batchCount === batchSize) {
          await batch.commit();
          batchCount = 0;
          batch = this.firestore.firestore.batch(); // Reset the batch
        }
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
    }

  }


  createConsultation(consultation: {}) {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return this.firestore
        .collection('consultants')
        .doc(userId)
        .collection('consultations')
        .add(consultation);
    }
    return throwError(new Error('No uid'));
  }

  createConsultant(consultant: Consultant) {
    return throwError(new Error('Not implemented'));
  }

  getConsultantAbsences() {
    const userId = this.authService.userId.value;
    if (userId !== null) {

      return this.firestore
        .collection('consultants')
        .doc(userId)
        .collection('absences')
        .valueChanges({idField: 'id'});
    }
    return throwError(new Error('No uid'));

  }

}
