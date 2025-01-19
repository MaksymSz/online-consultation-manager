import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {Consultant} from '../../../models/consultant';
import {ConsultantsService} from '../../../services/consultants.service';

@Component({
  selector: 'consultants-summary',
  standalone: false,

  templateUrl: './consultants-summary.component.html',
  styleUrl: './consultants-summary.component.css'
})
export class ConsultantsSummaryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'specialization', 'consultations'];
  dataSource = new MatTableDataSource<(Consultant & { consultationCount: number })>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private consultantService: ConsultantsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchConsultants();
  }

  fetchConsultants(): void {
    this.consultantService.getConsultantsSummary().subscribe((consultants) => {
      this.dataSource.data = consultants;
      this.dataSource.paginator = this.paginator;
    });
  }

  goToCreateConsultant(): void {
    console.log('goToCreate Consultant');
    // this.router.navigate(['/create-consultant']);
  }
}
