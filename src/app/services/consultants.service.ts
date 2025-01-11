import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Consultant} from '../models/consultant';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantsService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  getConsultants(): AngularFirestoreCollection<Consultant> {
    return this.firestore.collection<Consultant>('consultants');
  }

  getConsultations(consultantId: string) {
    return this.firestore
      .collection('consultants')
      .doc(consultantId)
      .collection('consultations')
      .valueChanges();
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
}
