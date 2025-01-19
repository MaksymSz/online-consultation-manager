import {NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarComponent} from './components/patient/calendar/calendar.component';

import {HttpClientModule} from '@angular/common/http';
import {ReservationsLocalJson} from './services/old/reservations-local-json';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {SlotDialogComponent} from './components/slot-dialog/slot-dialog.component';
import {HomeComponent} from './home/home.component';
import {ScheduleComponent} from './components/consultant/schedule/schedule.component';
import {PatientsComponent} from './components/consultant/patients/patients.component';
import {CreateDialogComponent} from './components/consultant/create-dialog/create-dialog.component';
import {HomeConsultantComponent} from './components/consultant/home-consultant/home-consultant.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {BasketComponent} from './components/patient/basket/basket.component';
import {SchedulePatientComponent} from './components/patient/schedule-patient/schedule-patient.component';
import {HomePatientComponent} from './components/patient/home-patient/home-patient.component';
import {ConsultantsListComponent} from './components/patient/consultants-list/consultants-list.component';
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from '@angular/material/core';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {ReservationDialogComponent} from './components/patient/reservation-dialog/reservation-dialog.component';
import {MatFormField} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperIcon,
  MatStepperNext,
  MatStepperPrevious
} from "@angular/material/stepper";
import {ReactiveFormsModule} from '@angular/forms';
import {MatToolbar} from "@angular/material/toolbar";

import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment'
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { ItemListComponent } from './components/item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MetaCalendarComponent } from './meta-calendar/meta-calendar.component';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en-GB';

import { LOCALE_ID } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import { CommentsComponent } from './components/admin/comments/comments.component';
// registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PatientsComponent,
    HomeConsultantComponent,
    SchedulePatientComponent,
    HomePatientComponent,
    ConsultantsListComponent,
    AdminPanelComponent,
    WelcomePageComponent,
    MetaCalendarComponent,
    CommentsComponent,
  ],
  imports: [
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    MatLine, MatExpansionModule, MatIcon, MatDivider, ReservationDialogComponent, MatFormField, MatDatepickerInput, MatDatepickerToggle, MatDatepicker, MatInput, MatStepper, MatStep, MatStepperNext, MatStepperPrevious, MatStepperIcon, ReactiveFormsModule, MatStepLabel, BasketComponent, MatToolbar, ItemListComponent, LoginComponent, RegisterComponent, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, NgOptimizedImage, MatCardImage
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [ReservationsLocalJson,
    provideAnimationsAsync(),
    // { provide: LOCALE_ID, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // Register custom icon
    iconRegistry.addSvgIcon(
      'custom-icon', // Name of the icon
      sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.ico') // Path to the SVG
    );
  }
}
