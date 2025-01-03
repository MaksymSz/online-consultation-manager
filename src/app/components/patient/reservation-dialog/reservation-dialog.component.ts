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
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},]
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._adapter.setLocale('pl-PL');
    // Initialize the form
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
    });
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return this.data.consultation.weekdays[WeekdaysMap[day]];
  };

  get maxNumberValue() {
    const selectedSlot = this.form.get('timeSlot')?.value;
    const selectedTimeSlot = this.data.timeSlots.find((slot: { slot: any; }) => slot.slot === selectedSlot);
    return selectedTimeSlot ? selectedTimeSlot.maxValue : 0;
  }

  getAvailableSlotForDate(date: Date): string[] {
    return 'A B C'.split(' ');
  }

  onDateChange(selectedDate: Date): void {
    if (!selectedDate) {
      this.form.patchValue({timeSlot: ''});
      this.availableSlots = []
      return;
    }

    this.availableSlots = this.getAvailableSlotForDate(selectedDate);
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
