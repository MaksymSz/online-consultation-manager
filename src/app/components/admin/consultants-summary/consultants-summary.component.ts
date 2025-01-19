import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {Consultant} from '../../../models/consultant';
import {ConsultantsService} from '../../../services/consultants.service';

@Component({
  selector: 'consultants-summary',
  standalone: false,

  templateUrl: './consultants-summary.component.html',
  styleUrl: './consultants-summary.component.css'
})
export class ConsultantsSummaryComponent implements OnInit {
  displayedColumns: string[] = ['id','name', 'specialization', 'email']; // Columns to display
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource to manage your data

  constructor(private consultantService: ConsultantsService) {
  }

  ngOnInit(): void {
    this.fetchConsultants(); // Fetch consultants when component initializes
  }

  fetchConsultants(): void {
    console.log('Fetching consultants...');
    this.consultantService.getConsultantsSummary().subscribe(
      (consultants) => {
        console.log('Consultants received:', consultants); // Log received data
        this.dataSource.data = consultants; // Assign consultants to the table's data
      },
      (error) => {
        console.error('Error fetching consultants:', error); // Handle any errors
      }
    );
  }
}
