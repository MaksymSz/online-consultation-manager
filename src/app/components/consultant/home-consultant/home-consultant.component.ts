import {Component, inject, model, OnInit} from '@angular/core';
import {format, startOfDay} from 'date-fns';
import {ConsultationsLocalJson} from '../../../services/consultations-local-json';
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
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';

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


  constructor(private consultationService: ConsultationsLocalJson, private dialog: MatDialog) {
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
          price: result.amount // Set a default or dynamic price
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

  protected readonly format = format;
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
  campaignForm: FormGroup;

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);


  constructor(private fb: FormBuilder,) {
    this._adapter.setLocale('pl-PL');
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],  // Name field
      minutes: ['', Validators.required],  // Timepicker field
      start: ['', Validators.required],  // Start date
      end: ['', Validators.required],  // End date
      amount: [0, Validators.required],  // Amount field
    });
  }

  onSave(): void {
    if (this.campaignForm.valid) {
      this.dialogRef.close(this.campaignForm.value);
    }// Return all form data
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
