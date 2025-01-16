import {Component, OnInit} from '@angular/core';
import {Consultant} from '../../../models/consultant';
import {MatExpansionModule} from '@angular/material/expansion';
import {Consultation} from '../../../models/consultation';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ReservationDialogComponent} from '../reservation-dialog/reservation-dialog.component';
import {ConsultantsService} from '../../../services/consultants.service';
import {BasketService} from '../../../services/basket.service';

@Component({
  selector: 'app-consultants-list',
  standalone: false,

  templateUrl: './consultants-list.component.html',
  styleUrl: './consultants-list.component.css'
})
export class ConsultantsListComponent implements OnInit {

  consultants: Consultant[] = [];
  consultations: { [key: string]: Consultation[] } = {};


  constructor(private consultantsService: ConsultantsService,
              private basketService: BasketService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // localStorage.setItem('basket', JSON.stringify([]));

    this.consultantsService.getConsultants().subscribe({
      next: data => {
        this.consultants = data;
        // console.log(data);

        data.forEach(consultant => {
          if (consultant.id) {
            this.consultantsService.getConsultations(consultant.id).subscribe({
              next: consultations => {
                if (consultant.id && consultations) {
                  // @ts-ignore
                  this.consultations[consultant.id] = consultations;
                }
              }
            })
          }
        })

      },
    });
  }

  //@ts-ignore
  filterConsultations(consultantId) {
    // @ts-ignore
    return this.consultations[consultantId];
  }

  openDialog(consultation: Consultation): void {
    console.log("Opened: ", consultation);
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '1200px',
      data: {
        consultation: consultation,
        timeSlots: [
          {slot: '9:00 AM', maxValue: 1},
          {slot: '10:00 AM', maxValue: 2},
          {slot: '11:00 AM', maxValue: 3},
          {slot: '12:00 PM', maxValue: 4},
          {slot: '1:00 PM', maxValue: 5},
          {slot: '2:00 PM', maxValue: 6},
          {slot: '3:00 PM', maxValue: 7},
          {slot: '4:00 PM', maxValue: 8}
        ],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog result: ", result);
      if (result) {
        // console.log('Dialog data:', result);
        this.basketService.appendBasket(result);
        // const retrievedBasket = JSON.parse(localStorage.getItem('basket') || '[]');
        // retrievedBasket.push(result);
        // localStorage.setItem('basket', JSON.stringify(retrievedBasket));

        // console.log(retrievedBasket);
      }
    });
  }

}
