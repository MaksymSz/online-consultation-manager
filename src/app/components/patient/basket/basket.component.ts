import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Reservation} from '../../../models/old/reservation';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';
import {addHours, addMinutes, startOfDay} from 'date-fns';
import {BasketService} from '../../../services/basket.service';
import {AuthService} from '../../../services/auth.service';
import {PatientsService} from '../../../services/patients.service';
import {MatIcon} from '@angular/material/icon';


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
    KeyValuePipe,
    MatIcon,
  ]
})
export class BasketComponent implements OnInit {
  basket: any;
  totalPrice: number = 0;
  isLoading: boolean = true;
  reservations: { [key: string]: any } = {};

  ngOnInit(): void {
    this.totalPrice = 0;
    this.basketService.getUserBasket().subscribe({
      next: data => {
        data.forEach(element => {
          this.reservations[element.id] = element;
        })

        Object.values(this.reservations).forEach(item => {
          this.totalPrice += item.price * item.duration;
        });

        if (!this.reservations) {
          this.firstFormGroup.setValue({
            firstCtrl: ''
          });
        } else {
          this.firstFormGroup.setValue({
            firstCtrl: 'blocked'
          });
        }

      }
    })
  }

  constructor(private patientsService: PatientsService,
              private basketService: BasketService,
              private authService: AuthService,) {
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  deleteItem(index: string) {
    console.log(index);
    this.totalPrice -= this.reservations[index].price * this.reservations[index].duration;
    this.basketService.deleteReservationFromBasket(this.reservations[index].id);
    delete this.reservations[index];
    console.log("items in basket: ", Object.keys(this.reservations).length);
    console.log("price of basket: ", this.totalPrice);
    if (!Object.keys(this.reservations).length) {
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

    const userId = this.authService.userId.value;
    // add new reservations
    let slot_idx = 0;
    Object.values(this.reservations).forEach(item => {
      // console.log(item);
      let slotTime = item.timeSlot.split(':');
      let slotDate = new Date(item.datePicker);
      slotDate.setHours(slotTime[0], slotTime[1]);
      slotDate = addHours(slotDate, 1);
      // console.log(slotDate)
      // slotDate = addMinutes(slotDate, 30 * slot_idx);
      // slot_idx += 1;
      // console.log(slotDate)

      let reservation = {
        patientId: userId,
        consultantId: item.consultantId,
        consultationId: item.consultationId,
        patientFullName: item.name + ' ' + item.surname,
        _date: addHours(startOfDay(slotDate), 1).toISOString(),
        date: addHours(slotDate, 1).toISOString(),
        genre: item.genre,
        gender: item.gender,
        age: item.age,
        additionalInfo: item.message,
        canceled: false,
      }

      // console.log(reservation)
      // console.log('xxxx')


      for (let i = 0; i < item.duration; i++) {
        reservation.date = addMinutes(slotDate, 30 * i).toISOString();
        // console.log(addMinutes(slotDate, 30 * i))
        // console.log(slotDate)
        // console.log(reservation)
        this.patientsService.createReservation(reservation).subscribe({
          next: (response) => {
            // console.log('Reservation created successfully:', response);
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
          },
        });
        // slotDate = addMinutes(slotDate, 30);
        // reservation.date = slotDate.toISOString();
      }
    })
    // Object.values(this.reservations).forEach(item => {
    //   this.basketService.deleteReservationFromBasket(item.id);
    // });
    //
    // this.reservations = {};
    // this.totalPrice = 0;
    // this.firstFormGroup.setValue({
    //   firstCtrl: ''
    // });
  }


  isEditable = false;
}
