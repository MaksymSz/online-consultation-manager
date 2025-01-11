import { Injectable } from '@angular/core';
import {Reservation} from '../models/reservation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) { }

  appendBasket(reservation: any) {
    const userId = this.authService.userId.value;
    if (userId !== null) {
      return this.firestore
        .collection('patients')
        .doc(userId)
        .collection('basket')
        .add(reservation);
    }
    return throwError(new Error('No uid'));

  }
}
