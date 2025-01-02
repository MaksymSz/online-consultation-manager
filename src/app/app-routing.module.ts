import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {HomeComponent} from './home/home.component';
import {ScheduleComponent} from './components/consultant/schedule/schedule.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'calendar', component: CalendarComponent }, // Route to CalendarComponent
  {path: 'consultant/schedule', component: ScheduleComponent },
  { path: '**', redirectTo: 'calendar' } // Wildcard route for 404 (optional)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
