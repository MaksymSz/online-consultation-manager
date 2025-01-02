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
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
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
    this.consultationService.getConsultations().subscribe({
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
        console.log(result);
        console.log(result.campaignOne.start);
        console.log(result.campaignOne.end);
        // const newConsultation: Consultation = {
        //   id: 0, // JSON Server will auto-generate this if using auto-increment
        //   name: result.name, // Set default or dynamic name
        //   slotTime: result.minutesP, // Use selected date or fallback
        //   repeatFrom: result.campaignOne.start, // Use start date from campaignOne
        //   repeatTo: result.campaignOne.end, // Use end date from campaignOne
        //   price: 100, // Set a default or dynamic price
        //   consultantId: 1 // Set the consultantId dynamically if needed
        // };
        //
        // this.consultationService.createConsultation(newConsultation).subscribe({
        //   next: createdConsultation => {
        //     console.log('Consultation created:', createdConsultation);
        //     // Update the dataSource to reflect new data
        //     this.dataSource.data = [...this.dataSource.data, createdConsultation];
        //   },
        //   error: err => {
        //     console.error('Error creating consultation:', err);
        //   }
        // });
      }

      // this.selectedDate.set(result);
      // console.log(result);
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

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date(this.year, this.month, this.today.getDate())),
    end: new FormControl(new Date(this.year, this.month, this.today.getDate())),
  });
  // readonly date = new FormControl(new Date());
  // FormGroup to capture all inputs
  // consultationForm = new FormGroup({
  //   name: new FormControl(''), // For name input
  //   time: new FormControl(new Date()), // For time picker
  //   price: new FormControl(0), // For price input
  //   campaignOne: new FormGroup({
  //     start: new FormControl(new Date(this.year, this.month, this.today.getDate())),
  //     end: new FormControl(new Date(this.year, this.month, this.today.getDate())),
  //   }),
  // });


  constructor() {
    this._adapter.setLocale('pl-PL');
  }
  //
  // onSave(): void {
  //   this.dialogRef.close(this.consultationForm.value); // Return all form data
  // }
  //
  // onCancel(): void {
  //   this.dialogRef.close();
  // }
}
