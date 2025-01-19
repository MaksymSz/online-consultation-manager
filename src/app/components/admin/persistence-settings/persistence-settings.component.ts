import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'persistence-settings',
  templateUrl: './persistence-settings.component.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    MatButton,
    MatCardTitle
  ],
  styleUrl: './persistence-settings.component.css'
})
export class PersistenceSettingsComponent {
  persistenceOptions = ['LOCAL', 'SESSION', 'NONE'];
  selectedPersistence: string = 'LOCAL'; // Default value

  constructor(private authService: AuthService) {}

  onPersistenceChange(): void {
    this.authService.setPersistence(this.selectedPersistence).then(() => {
      console.log(`Persistence set to: ${this.selectedPersistence}`);
    }).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  }
}
