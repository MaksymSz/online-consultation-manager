import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {CalendarComponent} from '../components/patient/calendar/calendar.component';
import {ScheduleComponent} from '../components/consultant/schedule/schedule.component';

@Component({
  selector: 'app-meta-calendar',
  standalone: false,

  templateUrl: './meta-calendar.component.html',
  styleUrl: './meta-calendar.component.css'
})
export class MetaCalendarComponent {
  constructor(public authService: AuthService) {
  }
}
