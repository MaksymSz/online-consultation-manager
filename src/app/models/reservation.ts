export interface Reservation {
  id: number;
  patientId: number;
  patientFullName: string;
  date: string;  // Date as string in ISO format (e.g., "2025-01-01T14:30:00Z")
  genre: string;
  gender: string;
  age: number;
  additionalInfo: string;
  canceled: boolean;
}
