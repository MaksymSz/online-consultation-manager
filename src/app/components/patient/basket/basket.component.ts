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
  }

  isEditable = false;
}
