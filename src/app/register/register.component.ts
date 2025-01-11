import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'patient'; // Default role, you can change this as needed
  nickname: string = '';
  errorMessage: string | null = null

  constructor(private authService: AuthService, private router: Router) {
  }

  // Register function triggered on form submission
  async onRegister() {
    if (this.email && this.password && this.nickname && this.role) {
      await this.authService
        .register(this.email, this.password, this.nickname, this.role)
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
