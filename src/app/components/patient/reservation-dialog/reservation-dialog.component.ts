import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule, MatLabel, MatError, MatHint} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  provideNativeDateAdapter
} from '@angular/material/core';
import {DatepickerDialog} from '../../consultant/home-consultant/home-consultant.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {WeekdaysMap} from '../../../utils/weekdays';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';
import {Reservation} from '../../../models/old/reservation';
import {addMinutes, format} from 'date-fns';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDialogTitle,
    NgIf,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatError,
    MatDialogContent,
    MatHint,
    MatSelect,
    MatOption,
    // MatTimepicker,
    // MatTimepickerToggle,
    // MatIcon,
    // MatTimepickerInput,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgForOf,
  ],
  styleUrl: './reservation-dialog.component.css',
  providers: [provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'en-EN'},
  ]
})
export class ReservationDialogComponent {
  form: FormGroup;
  dialogRef = inject<MatDialogRef<DatepickerDialog>>(
    MatDialogRef<DatepickerDialog>,
  );
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  availableSlots: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsLocalJson,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._adapter.setLocale('en-EN');
    // Initialize the form
    console.log(data.consultation.consultantId);
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      genre: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      datePicker: ['', Validators.required],
      timeSlot: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      message: ['', Validators.maxLength(256)],
      price: this.data.consultation.price,
      consultantId: this.data.consultation.consultantId,
      consultationId: this.data.consultation.id,
    });
    this.form.get('datePicker')?.valueChanges.subscribe((selectedDate: Date) => {
      this.onDateChange(selectedDate);
    });

  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    const today = new Date();
    if (d && d < today) return false;
    return this.data.consultation.weekdays[WeekdaysMap[day]];
  };

  get maxNumberValue() {
    const selectedSlot = this.form.get('timeSlot')?.value;
    const selectedTimeSlot = this.availableSlots.find(s => s[0] === selectedSlot);
    return selectedTimeSlot ? selectedTimeSlot[1] : 0;
  }

  async getAvailableSlotForDate(date: Date): Promise<[string, number][]> {
    let yy = this.data.consultation.slotTime.split(':');

    let slots: Record<string, number> = {};
    let slotTime = date;
    slotTime.setHours(yy[0], yy[1]);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    for (let i = 0; i < this.data.consultation.repeat; i++) {
      slots[format(slotTime, 'HH:mm')] = 1;
      slotTime = addMinutes(slotTime, 30); // Move to the next slot
    }

    const data = await firstValueFrom(this.reservationsService.getReservationsByConsultant(this.data.consultation.consultantId, date));

    data.forEach((reservation: Reservation) => {
      if (reservation.consultationId === this.data.consultation.id) {
        slots[format(reservation.date, 'HH:mm')] = -1;
      }
    });

    const slotsArray = Object.entries(slots);

    let dd = 1;
    for (let i = slotsArray.length - 1; i >= 0; i--) {
      if (slotsArray[i][1] === -1) dd = 1;
      else {
        slotsArray[i][1] = dd;
        ++dd;
      }
    }

    return slotsArray.filter(ss => ss[1] > 0)
  }

  onDateChange(selectedDate: Date): void {
    if (!selectedDate) {
      this.form.patchValue({timeSlot: ''});
      this.availableSlots = []
      return;
    }
    (async () => {
      this.availableSlots = await this.getAvailableSlotForDate(selectedDate);
      // console.log(this.availableSlots);
    })();

  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
