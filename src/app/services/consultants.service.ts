import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Consultant} from '../models/consultant';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Consultation} from '../models/consultation';
import {
  startOfDay,
} from 'date-fns';

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

  getConsultations(consultantId: string) {
    return this.firestore
      .collection('consultants')
      .doc(consultantId)
      .collection<Consultation>('consultations')
      .valueChanges({idField: 'id'});
  }

  createAbsence(date: Date) {
    date = startOfDay(date);
    const userId = this.authService.userId.value;
    if (userId !== null) {
      const absence = {
        date: date.toISOString(),
      }
      this.firestore
        .collection('consultants')
        .doc(userId)
        .collection('absences')
        .add(absence);
    }

    const batch = this.firestore.firestore.batch();
    // Step 2: Query all patients
    return this.firestore.collection('patients').get().toPromise().then((querySnapshot) => {
      // @ts-ignore
      querySnapshot.forEach((patientDoc) => {
        // Step 3: Get reservations for the specific day
        const reservationsRef = this.firestore
          .collection('patients')
          .doc(patientDoc.id)
          .collection('reservations', (ref) =>
            ref.where('_date', '==', date) // Assuming the date is stored as a string
          );

        // Step 4: Perform update for each reservation on that day
        reservationsRef.get().toPromise().then((reservationSnapshot) => {
          // @ts-ignore
          reservationSnapshot.forEach((reservationDoc) => {
            // Update the reservation status
            const reservationRef = this.firestore
              .collection('patients')
              .doc(patientDoc.id)
              .collection('reservations')
              .doc(reservationDoc.id);

            // Add the update operation to the batch
            // @ts-ignore
            batch.update(reservationRef, {canceled: true});
          });

          // Step 5: Commit the batch update
          batch.commit().then(() => {
            console.log('Reservations updated successfully!');
          }).catch((error) => {
            console.error('Error updating reservations: ', error);
          });
        });
      });
    });
  }

  // createAbsence(date: Date) {
  //   const userId = this.authService.userId.value;
  //   if (userId !== null) {
  //     const absence = {
  //       date: date.toISOString(),
  //     }
  //     this.firestore
  //       .collection('consultants')
  //       .doc(userId)
  //       .collection('absences')
  //       .add(absence);
  //
  //   }
  //   return throwError(new Error('No uid'));
  // }

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
}
