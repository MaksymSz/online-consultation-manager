import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'admin-panel',
  standalone: false,

  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
constructor(private authService: AuthService) {
  console.log('AdminPanelComponent constructor');
}
}
