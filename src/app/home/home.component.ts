import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import{HomeConsultantComponent} from '../components/consultant/home-consultant/home-consultant.component';
import {HomePatientComponent} from '../components/patient/home-patient/home-patient.component';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(protected authService: AuthService,) {
  }

}
