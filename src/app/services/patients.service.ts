import {Injectable} from '@angular/core';
import {Reservation} from '../models/reservation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';
import {Consultation} from '../models/consultation';
import {from, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
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
}
