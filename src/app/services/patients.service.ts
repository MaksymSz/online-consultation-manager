import {Injectable} from '@angular/core';
import {Reservation} from '../models/reservation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }
}
