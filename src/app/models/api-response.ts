import {Consultation} from './consultation';
import {Reservation} from './reservation';
import {Consultant} from './consultant';

export interface ApiResponse {
  consultants: Consultant[];
  consultations: Consultation[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}
