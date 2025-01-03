import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {format} from 'date-fns';
import {Consultation} from '../models/consultation';
import {ApiResponse} from '../models/api-response';
import {Absence} from '../models/absence';
import {Reservation} from '../models/reservation';

@Injectable({
  providedIn: 'root',
})
export class ConsultationsLocalJson {
  private apiUrl = 'http://localhost:3000'; // JSON Server base URL

  constructor(private http: HttpClient) {
  }
  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/consultations`);
  }

  // Fetch all reservations
  getConsultations(consultantId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/consultations`).pipe(
      map((consultations) =>
        consultations.filter((consultation) => {
          const repeatFrom = new Date(consultation.repeatFrom);
          const repeatTo = new Date(consultation.repeatTo);
          return consultation.consultantId === consultantId;
        })
      )
    );
  }

  // Fetch reservations for a specific patient on a specific day
  getConsultantConsultationsByDay(consultantId: number, date: Date): Observable<Consultation[]> {
    const dateTime = format(date, 'yyyy-MM-dd');
    return this.http.get<Consultation[]>(`${this.apiUrl}/consultations`).pipe(
      map((consultations) =>
        consultations.filter((consultation) => {
          const repeatFrom = new Date(consultation.repeatFrom);
          const repeatTo = new Date(consultation.repeatTo);
          return consultation.consultantId === consultantId && repeatFrom <= date && date <= repeatTo;
        })
      )
    );
  }

  addAbsence(consultantId: number, date: Date) {
    const newAbsence = {
      "consultantId": consultantId,
      "date": date,
    }
    this.http.post<Absence>(`${this.apiUrl}/absences`, newAbsence).subscribe({
      next: (response) => {
        console.log('Absence added successfully', response);
        // After the absence is successfully added, update consultations' status
        this.updateConsultationsStatusAndPatch(consultantId, date);
      },
      error: (err) => {
        console.error('Error adding absence:', err);
      }
    });

  }

  // Your method to update the status field and send PATCH requests:
  updateConsultationsStatusAndPatch(consultantId: number, date: Date): Observable<void> {
    return this.getConsultantConsultationsByDay(consultantId, date).pipe(
      map(consultations => {
        consultations.forEach(consultation => {
          consultation.canceled = true;

          this.updateConsultationStatus(consultation);
        });
      })
    );
  }

// Method to send PATCH request to update the status of each consultation in the database
  updateConsultationStatus(consultation: Consultation): void {
    this.http.patch(`${this.apiUrl}/consultations/${consultation.id}`, {
      status: consultation.canceled
    }).subscribe(response => {
      console.log('Consultation status updated successfully', response);
    });
  }

  // Delete a reservation by ID
  deleteConsultation(consultationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consultations/${consultationId}`);
  }

  // Create a new reservation
  createConsultation(consultation: {}): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/consultations`, consultation);
  }

  // Update an existing reservation
  updateConsultation(consultation: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/consultations/${consultation.id}`, consultation);
  }
}
