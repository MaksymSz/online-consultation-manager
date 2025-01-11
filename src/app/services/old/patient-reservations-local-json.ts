import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {format} from 'date-fns';
import {Consultant} from '../../models/old/consultant';

@Injectable({
  providedIn: 'root',
})
export class PatientReservationsLocalJson {
  private apiUrl = 'http://localhost:3000'; // JSON Server base URL

  constructor(private http: HttpClient) {
  }

  getConsultants(): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(`${this.apiUrl}/consultants`);
  }

  deleteConsultation(consultantId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consultants/${consultantId}`);
  }

  createConsultation(consultant: {}): Observable<Consultant> {
    return this.http.post<Consultant>(`${this.apiUrl}/consultants`, consultant);
  }

  updateConsultation(consultant: Consultant): Observable<Consultant> {
    return this.http.put<Consultant>(`${this.apiUrl}/consultants/${consultant.id}`, consultant);
  }
}
