import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {HomeComponent} from './home/home.component';
import {ScheduleComponent} from './components/consultant/schedule/schedule.component';
import {HomeConsultantComponent} from './components/consultant/home-consultant/home-consultant.component';
import {HomePatientComponent} from './components/patient/home-patient/home-patient.component';
import {ConsultantsListComponent} from './components/patient/consultants-list/consultants-list.component';
import {BasketComponent} from './components/patient/basket/basket.component';
import {SchedulePatientComponent} from './components/patient/schedule-patient/schedule-patient.component';
import {ItemListComponent} from './components/item-list/item-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent}, // Default route
  {path: 'calendar', component: CalendarComponent}, // Route to CalendarComponent
  {path: 'consultant/schedule', component: ScheduleComponent},
  {path: 'consultant', component: HomeConsultantComponent},
  {path: 'patient/consultants', component: ConsultantsListComponent},
  {path: 'patient/schedule', component: SchedulePatientComponent},
  {path: 'patient/basket', component: BasketComponent},
  {path: 'patient', component: HomePatientComponent},
  {path: 'test', component: ItemListComponent},
  {path: '**', redirectTo: 'calendar'} // Wildcard route for 404 (optional)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
