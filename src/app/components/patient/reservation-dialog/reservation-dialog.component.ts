import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule, MatLabel, MatError, MatHint} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatIcon} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import {DatepickerDialog} from '../../consultant/home-consultant/home-consultant.component';
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
    MatTimepicker,
    MatTimepickerToggle,
    MatIcon,
    MatTimepickerInput,
  ],
  styleUrl: './reservation-dialog.component.css',
  providers: [provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},]
})
export class ReservationDialogComponent {
  form: FormGroup;
  dialogRef = inject<MatDialogRef<DatepickerDialog>>(
    MatDialogRef<DatepickerDialog>,
  );
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._adapter.setLocale('pl-PL');
    // Initialize the form
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Pass form data back to parent
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
