import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf, NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Reservation} from '../../../models/old/reservation';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';
import {addMinutes} from 'date-fns';

@Component({
  selector: 'app-basket',

  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
  imports: [
    MatLabel,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatList,
    MatListItem,
    NgForOf,
    MatDivider,
    NgIf,
    MatProgressSpinner,
  ]
})
export class BasketComponent implements OnInit {
  basket: any;
  totalPrice: number = 0;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.basket = JSON.parse(localStorage.getItem('basket') || '[]');
    if (!this.basket.length) {
      this.firstFormGroup.setValue({
        firstCtrl: ''
      });
    } else {
      this.firstFormGroup.setValue({
        firstCtrl: 'blocked'
      });
    }

    console.log(this.basket);
    this.basket.forEach((item: any) => {
      this.totalPrice += item.price * item.duration;
    })
  }

  constructor(private reservationsService: ReservationsLocalJson,) {
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  deleteItem(index: number) {
    this.totalPrice -= this.basket[index].price * this.basket[index].duration;

    this.basket.splice(index, 1);
    if (!this.basket.length) {
      this.firstFormGroup.setValue({
        firstCtrl: ''
      });
    }
    console.log(this.firstFormGroup.value);

  }

  handleNextClick(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);

    // add new reservations
    this.basket.forEach((item: any) => {
      console.log(item);
      let slotTime = item.timeSlot.split(':');
      let slotDate = new Date(item.datePicker);
      slotDate.setHours(slotTime[0], slotTime[1]);

      let reservation = {
        patientId: 101,
        consultantId: item.consultantId,
        consultationId: item.consultationId,
        patientFullName: item.name + ' ' + item.surname,
        date: slotDate.toISOString(),
        genre: item.genre,
        gender: item.gender,
        age: item.age,
        additionalInfo: item.message,
        canceled: false,
      }

      for (let i = 0; i < item.duration; i++) {
        console.log(reservation)
        this.reservationsService.createReservation(reservation).subscribe({
          next: (response) => {
            console.log('Reservation created successfully:', response);
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
          },
        });
        slotDate = addMinutes(slotDate, 30);
        reservation.date = slotDate.toISOString();
      }
    })
    // localStorage.setItem('basket', JSON.stringify([]));
  }


  isEditable = false;
}

// id, consultantId, consultationId
