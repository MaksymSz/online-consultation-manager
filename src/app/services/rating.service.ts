import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Rating} from '../models/rating';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private firestore: AngularFirestore) {}

  // Check if the patient has already rated this consultant
  checkIfRated(patientId: string, consultantId: string): Observable<Rating[]> {
    return this.firestore
      .collection<Rating>('ratings', ref => ref
        .where('patientId', '==', patientId)
        .where('consultantId', '==', consultantId)
      )
      .valueChanges();
  }

  // Add a new rating to the collection
  addRating(rating: Rating): Promise<any> {
    return this.firestore.collection('ratings').add(rating);
  }

  getAllRatings(): Observable<Rating[]> {
    return this.firestore.collection<Rating>('ratings').valueChanges({ idField: 'id' });
  }

  // Delete a rating from Firestore
  deleteRating(id: string): Promise<void> {
    return this.firestore.collection('ratings').doc(id).delete();
  }
}
