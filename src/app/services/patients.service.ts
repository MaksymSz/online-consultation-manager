import {Injectable} from '@angular/core';
import {Reservation} from '../models/reservation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';
import {Consultation} from '../models/consultation';
import {from, map, Observable, throwError} from 'rxjs';
import {addHours, format, startOfDay} from 'date-fns';
import {Patient} from '../models/old/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  getPatients() {
    return this.firestore
      .collection<Patient>('patients')
      .valueChanges({idField: 'id'});
  }

  toggleBan(patient: Patient) {
    return this.firestore
      .collection('patients')
      .doc(patient.id)
      .update({ banned: !patient.banned });
  }

  getReservations() {
    const userId = this.authService.userId.value;
    console.log("getConsultations", userId);
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection<Reservation>('reservations')
        .valueChanges({idField: 'id'});
    }
    return throwError(new Error('No uid'));
  }

  createReservation(reservation: any) {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return from(this.firestore
        .collection('patients')
        .doc(userId)
        .collection('reservations')
        .add(reservation)
      )
    }
    return throwError(new Error('No uid'));
  }

  // Fetch reservations for a specific patient on a specific day
  getPatientReservationsByDay(date: Date): Observable<Reservation[]> {
    const patientId = this.authService.userId.value;
    // console.log(date);
    const formattedDate = addHours(startOfDay(date), 1).toISOString();
    // console.log(formattedDate);
    return this.firestore
      .collection('patients')
      .doc(patientId)
      .collection<Reservation>('reservations', ref =>
        ref.where('_date', '==', formattedDate)
      ).valueChanges({idField: 'id'});
  }


  // Delete a reservation by ID
  deleteReservation(reservationId: string) {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection('reservations')
        .doc(reservationId)
        .delete()
        .then(() => console.log('Item deleted successfully'))
        .catch(error => {
          console.log('Error deleting item:', error);
        });
    }
    return throwError(new Error('No uid'));
  }

  getEarliestReservation() {
    const userId = this.authService.userId.value;
    console.log(userId);
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection<Reservation>('reservations', (ref) => ref.orderBy('date', 'asc').limit(1))
        .valueChanges()
        .pipe(
          map((docs) => {
            return docs[0];
          })
        );
    }

    return throwError(new Error('No uid'));
  }
}
