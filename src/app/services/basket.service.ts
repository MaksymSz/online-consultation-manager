import {Injectable} from '@angular/core';
import {Reservation} from '../models/reservation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  appendBasket(reservation: any) {
    const userId = this.authService.userId.value;
    console.log("basket service: ", userId);
    console.log("basket service: ", reservation);
    console.log(`Firestore path: patients/${userId}/basket`);

    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection('basket')
        .add(reservation)
        .then(() => console.log('Item added successfully'))
        .catch(error => {
          console.error('Error adding item:', error);
          throw error;
        });
    }
    return throwError(new Error('No uid'));
  }

  getUserBasket() {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection('basket')
        .valueChanges({idField: 'id'})
    }
    return throwError(new Error('No uid'));
  }

  deleteReservationFromBasket(reservationId: string) {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection('basket')
        .doc(reservationId)
        .delete()
        .then(() => console.log('Item deleted successfully'))
        .catch(error => {
          console.log('Error deleting item:', error);
        });
    }
    return throwError(new Error('No uid'));
  }
}
