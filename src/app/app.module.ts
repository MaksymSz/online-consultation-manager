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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PatientsComponent,
    HomeConsultantComponent,


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
