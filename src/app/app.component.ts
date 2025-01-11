import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'demo-calendar';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUserRole$.subscribe((role) => {
      this.userRole = role; // This will update whenever the role changes
      // console.log('User role:', this.userRole);
    });
  }

  ngOnInit(): void {
    // this.authService.restoreSession();
  }

  // Call the logout method from AuthService
  onLogout() {
    this.authService.logout();  // Sign out the user
    console.log('logout');
  }
}
