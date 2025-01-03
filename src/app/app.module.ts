import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';

import {HttpClientModule} from '@angular/common/http';
import {ReservationsLocalJson} from './services/reservations-local-json';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { SlotDialogComponent } from './components/slot-dialog/slot-dialog.component';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './components/consultant/schedule/schedule.component';
import { PatientsComponent } from './components/consultant/patients/patients.component';
import { CreateDialogComponent } from './components/consultant/create-dialog/create-dialog.component';
import { HomeConsultantComponent } from './components/consultant/home-consultant/home-consultant.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { BasketComponent } from './components/patient/basket/basket.component';
import { SchedulePatientComponent } from './components/patient/schedule-patient/schedule-patient.component';
import { HomePatientComponent } from './components/patient/home-patient/home-patient.component';
import { ConsultantsListComponent } from './components/patient/consultants-list/consultants-list.component';
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from '@angular/material/core';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import { ReservationDialogComponent } from './components/patient/reservation-dialog/reservation-dialog.component';
import {MatFormField} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PatientsComponent,
    HomeConsultantComponent,
    BasketComponent,
    SchedulePatientComponent,
    HomePatientComponent,
    ConsultantsListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    CreateDialogComponent,
    CalendarComponent,
    CreateDialogComponent,
    ScheduleComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatList,
    MatListItem,
    MatLine, MatExpansionModule, MatIcon, MatDivider, ReservationDialogComponent, MatFormField, MatDatepickerInput, MatDatepickerToggle, MatDatepicker, MatInput
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [ReservationsLocalJson, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {
}
