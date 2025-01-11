import {Component, computed, inject, model, OnInit} from '@angular/core';
import {format, startOfDay} from 'date-fns';
import {ConsultationsLocalJson} from '../../../services/old/consultations-local-json';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Consultation} from '../../../models/consultation';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatCheckbox} from '@angular/material/checkbox';
import {NgForOf} from '@angular/common';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';

export interface DialogData {
  selectedDate: Date;
}

@Component({
  selector: 'app-home-consultant',
  standalone: false,

  templateUrl: './home-consultant.component.html',
  styleUrl: './home-consultant.component.css'
})
export class HomeConsultantComponent implements OnInit {
  consultations: Consultation[] = [];
  displayedColumns: string[] = ['name', 'slotTime', 'repeatFrom', 'repeatTo', 'price']
  dataSource = new MatTableDataSource<Consultation>();
  selectedDate = model<Date | null>(null);


  constructor(private consultationService: ConsultationsLocalJson, private dialog: MatDialog,
              private reservationService: ReservationsLocalJson) {
  }

  ngOnInit(): void {
    this.consultationService.getConsultations(101).subscribe({
      next: data => {
        this.consultations = data;
        // Add position index to each consultation (optional)
        const formattedData = data.map((consultation, index) => ({
          position: index + 1, // Add position number
          ...consultation      // Spread existing data
        }));
        this.dataSource.data = formattedData;
      },
      error: (err) => {
        console.log('Error fetching consultations:', err);
      }
    })

    console.log(this.consultations.length);
    console.log(this.consultations);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DatepickerDialog, {
      minWidth: '500px',
      data: {selectedDate: this.selectedDate()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.end.setHours(23, 59, 59, 999);
        const newConsultation = {
          // id: 0, // JSON Server will auto-generate this if using auto-increment
          name: result.name, // Set default or dynamic name
          consultantId: 101, // Set the consultantId dynamically if needed
          slotTime: format(result.minutes, 'HH:mm'), // Use selected date or fallback
          repeatFrom: result.start, // Use start date from campaignOne
          repeatTo: result.end, // Use end date from campaignOne
          price: result.amount, // Set a default or dynamic price
          weekdays: result.weekdays,
        };

        this.consultationService.createConsultation(newConsultation).subscribe({
          next: createdConsultation => {
            console.log('Consultation created:', createdConsultation);
            // Update the dataSource to reflect new data
            this.dataSource.data = [...this.dataSource.data, createdConsultation];
          },
          error: err => {
            console.error('Error creating consultation:', err);
          }
        });
      }

    });
  }

  openAbsenceDialog() {
    const dialogRef = this.dialog.open(AbsenceDialog, {
      minWidth: '500px',
      data: {selectedDate: this.selectedDate()},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.reservationService.addAbsence(101, result)
      }

    });
  }

  protected readonly format = format;
}

@Component({
  selector: 'absence-dialog',
  templateUrl: 'absence-dialog.html',
  imports: [
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
})
export class AbsenceDialog {
  dialogRef = inject<MatDialogRef<AbsenceDialog>>(
    MatDialogRef<AbsenceDialog>,
  );
  data = inject(MAT_DIALOG_DATA);

  readonly date = new FormControl(new Date());

  constructor() {
    const data = this.data;

    this.date.setValue(data.selectedDate);
  }
}


@Component({
  selector: 'datepicker-dialog',
  templateUrl: 'datepicker-dialog.html',
  imports: [
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInput,
    MatFormField,
    MatDatepickerToggle,
    ReactiveFormsModule,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatCheckbox,
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
})
export class DatepickerDialog {
  dialogRef = inject<MatDialogRef<DatepickerDialog>>(
    MatDialogRef<DatepickerDialog>,
  );
  data = inject(MAT_DIALOG_DATA);
  form: FormGroup;

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

  constructor(private fb: FormBuilder,) {
    this._adapter.setLocale('pl-PL');
    this.form = this.fb.group({
      name: ['', Validators.required],  // Name field
      minutes: ['', Validators.required],  // Timepicker field
      start: ['', Validators.required],  // Start date
      end: ['', Validators.required],  // End date
      amount: [0, Validators.required],  // Amount field
      weekdays: this.fb.group({
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false],
      }),
    });
  }


  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }// Return all form data
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
