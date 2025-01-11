export interface Consultation {
  id: number;
  name: string,
  consultantId: number,
  slotTime: string,
  repeat: number,
  repeatFrom: string,
  repeatTo: string,
  price: number,
  canceled: boolean,
  weekdays: {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean
  }
}
