import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Consultant} from '../models/consultant';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Consultation} from '../models/consultation';

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
    const userId = this.authService.userId.value;
    if (userId !== null) {
      const absence = {
        date: date.toISOString(),
      }
      return this.firestore
        .collection('consultants')
        .doc(userId)
        .collection('absences')
        .add(absence)
    }
    return throwError(new Error('No uid'));
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
}
