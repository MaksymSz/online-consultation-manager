import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';

import { HttpClientModule } from '@angular/common/http';
import { ReservationsLocalJson } from './services/reservations-local-json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarComponent,
    HttpClientModule,
  ],
  providers: [ReservationsLocalJson],
  bootstrap: [AppComponent]
})
export class AppModule { }
