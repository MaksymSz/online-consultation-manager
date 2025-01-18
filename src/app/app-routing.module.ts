import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './components/patient/calendar/calendar.component';
import {HomeComponent} from './home/home.component';
import {ScheduleComponent} from './components/consultant/schedule/schedule.component';
import {HomeConsultantComponent} from './components/consultant/home-consultant/home-consultant.component';
import {HomePatientComponent} from './components/patient/home-patient/home-patient.component';
import {ConsultantsListComponent} from './components/patient/consultants-list/consultants-list.component';
import {BasketComponent} from './components/patient/basket/basket.component';
import {ItemListComponent} from './components/item-list/item-list.component';
import {AuthGuard} from './services/auth.guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {MetaCalendarComponent} from './meta-calendar/meta-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  }, // Default route
  //guest subpages
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  //calendar
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    data: {roles: ['consultant', 'patient']},
    component: MetaCalendarComponent
  },
  {
    path: 'basket',
    component: BasketComponent,
    canActivate: [AuthGuard],
    data: {roles: ['patient']},
  },
  {
    path: 'consultants',
    component: ConsultantsListComponent,
    canActivate: [AuthGuard],
    data: {roles: ['patient']},
  },
  {
    path: '**',
    redirectTo: ''
  },

  //consultant subpages
  {
    path: 'consultant',
    component: HomeConsultantComponent,
    canActivate: [AuthGuard],
    data: {roles: ['consultant']},
  },
  {
    path: 'consultant/schedule',
    component: ScheduleComponent
  },
  //patient subpages
  {
    path: 'patient/consultants',
    component: ConsultantsListComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
