import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'admin-panel',
  standalone: false,

  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  userName: Observable<any> | undefined;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
        this.authService.getUserName().subscribe(
          (status) => {
            this.userName = status;
            console.log(`User name: ${this.userName}`);
          },
          (error) => {
            console.error('Error fetching user name:', error);
          }
        );

    }

  textToDisplay = 'Need to take action? Use the shortcuts on the left to manage users, consultations, and system settings. Click on any section to get started!';
}
