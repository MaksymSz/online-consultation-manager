import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatCard, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    MatFormField,
    MatButton,
    MatInput,
    MatCard,
    MatCardTitle
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  // Login function triggered on form submission
  async onLogin() {
    if (this.email && this.password) {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']); // Redirect after successful login
    } else {
      console.log('Please fill in both fields.');
    }
  }
}
