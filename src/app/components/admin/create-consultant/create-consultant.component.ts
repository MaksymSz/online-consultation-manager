import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../../services/auth.service';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-consultant',
  templateUrl: './create-consultant.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    FormsModule,
    MatCard,
    MatCardTitle,
    MatOption,
    MatSelect,
    NgIf
  ],
  styleUrl: './create-consultant.component.css'
})
export class CreateConsultantComponent {
  email: string = '';
  password: string = '';
  role: string = 'consultant'; // Default role, you can change this as needed
  nickname: string = '';
  specialization: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  async onRegister() {
    if (this.email && this.password && this.nickname && this.role) {
      await this.authService
        .registerConsultant(this.email, this.password, this.nickname, this.specialization)
        .then(() => {
          this.router.navigate(['/']);
        })
        .catch(error => {
          this.errorMessage = error;
        });
    } else {
      this.errorMessage = "Please fill in all fields";
      console.log('Please fill in all fields.');
    }
  }
}
