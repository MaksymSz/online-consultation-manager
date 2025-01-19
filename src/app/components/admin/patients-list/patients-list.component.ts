import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {Patient} from '../../../models/old/patient';
import {PatientsService} from '../../../services/patients.service';



@Component({
  selector: 'patients-list',
  standalone: false,

  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'banned', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private patientService: PatientsService) {}

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe((patients) => {
      this.dataSource.data = patients;
      this.dataSource.paginator = this.paginator;
    });
  }

  toggleBan(patient: Patient): void {
    this.patientService.toggleBan(patient).then(() => {
      console.log(`Updated ban status for ${patient.name}`);
    });
  }
}
