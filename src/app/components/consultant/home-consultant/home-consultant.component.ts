import {Component, computed, inject, model, OnInit} from '@angular/core';
import {subHours, differenceInMinutes, addHours, format, startOfDay, addMinutes, parse, isAfter} from 'date-fns';
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
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatCheckbox} from '@angular/material/checkbox';
import {NgForOf, NgIf} from '@angular/common';


import {ConsultantsService} from '../../../services/consultants.service';
import {AuthService} from '../../../services/auth.service';

export interface DialogData {
  selectedDate: Date;
}

@Component({
  selector: 'home-consultant',
  standalone: false,

  templateUrl: './home-consultant.component.html',
  styleUrl: './home-consultant.component.css'
})
export class HomeConsultantComponent implements OnInit {
  absences$: Observable<any[]>;
  consultations: Consultation[] = [];
  displayedColumns: string[] = ['name', 'slotTime', 'repeatFrom', 'repeatTo', 'price']
  dataSource = new MatTableDataSource<Consultation>();
  selectedDate = model<Date | null>(null);


  constructor(private authService: AuthService,
              private consultationService: ConsultantsService,
              private dialog: MatDialog) {
    this.absences$ = this.consultationService.getConsultantAbsences();
  }

  ngOnInit(): void {
    console.log(this.authService.userId.value);

    this.consultationService.getConsultations(this.authService.userId.value).subscribe({
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

  }

  openDialog() {
    const dialogRef = this.dialog.open(DatepickerDialog, {
      minWidth: '500px',
      data: {selectedDate: this.selectedDate()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result.end.setHours(23, 59, 59, 999);
        console.log(result.timeFrom);
        console.log(result.timeTo);

        const differenceMinutes = differenceInMinutes(result.timeTo, result.timeFrom);
        const intervals = Math.floor(differenceMinutes / 30);

        console.log(differenceMinutes);
        console.log(intervals);

        const newConsultation = {
          // id: 0, // JSON Server will auto-generate this if using auto-increment
          name: result.name, // Set default or dynamic name
          consultantId: this.authService.userId.value, // Set the consultantId dynamically if needed
          slotTime: format(result.timeFrom, 'HH:mm'), // Use selected date or fallback
          repeat: intervals, // Use selected date or fallback
          repeatFrom: addHours(result.start, 1).toISOString(), // Use start date from campaignOne
          repeatTo: addHours(startOfDay(result.end), 1).toISOString(), // Use end date from campaignOne
          price: result.amount, // Set a default or dynamic price
          weekdays: result.weekdays,
        };
        this.consultationService.createConsultation(newConsultation);
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
        this.consultationService.addAbsence(result)
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
  styleUrl: './datepicker-dialog.css',
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
    NgIf,
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
      timeFrom: ['', Validators.required],  // Timepicker field
      timeTo: ['', [Validators.required, this.timeValidator.bind(this)]],  // Timepicker field
      start: ['', Validators.required],  // Start date
      end: ['', Validators.required],  // End date
      amount: [0, [Validators.required, Validators.min(0)]],  // Amount field
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

  timeValidator(control: AbstractControl) {
    const timeFrom = this.form?.get('timeFrom')?.value;
    const timeTo = control.value;

    if (!timeFrom || !timeTo) return null; // Skip validation if either is missing

    // const fromDate = parse(timeFrom, 'HH:mm', new Date());
    // const toDate = parse(timeTo, 'HH:mm', new Date());

    return isAfter(timeTo, timeFrom) ? null : {timeInvalid: true}; // Return error if timeTo is not after timeFrom
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
