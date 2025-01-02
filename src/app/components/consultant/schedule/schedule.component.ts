import {Component, OnInit} from '@angular/core';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfDay,
  addMinutes
} from 'date-fns';
import {CommonModule} from '@angular/common';
import {Consultation} from '../../../models/consultation';
import {ConsultationsLocalJson} from '../../../services/consultations-local-json';

import {MatDialog} from '@angular/material/dialog';
import {CreateDialogComponent} from '../create-dialog/create-dialog.component';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  imports: [CommonModule],
})
export class ScheduleComponent implements OnInit {
  currentView: string = 'week'; // Can be 'week' or 'day'
  currentDate: Date = new Date(); // Initial date is the current date
  availableSlots: Record<string, Consultation | null> = {}; // Stores available slots for the day
  reservedSlots: Set<string> = new Set(); // Set to track reserved slots
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private consultationService: ConsultationsLocalJson, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.updateCalendar();
  }

  // Toggle between week and day views
  toggleView(view: string): void {
    this.currentView = view;

    this.updateCalendar();
  }

  // Navigate to previous or next day/week
  navigate(direction: string): void {
    if (this.currentView === 'day') {
      this.currentDate = direction === 'next' ? addDays(this.currentDate, 1) : subDays(this.currentDate, 1);
    } else if (this.currentView === 'week') {
      this.currentDate = direction === 'next' ? addWeeks(this.currentDate, 1) : subWeeks(this.currentDate, 1);
    }
    this.updateCalendar();
  }

  // Update calendar content based on current view and date
  updateCalendar(): void {
    if (this.currentView === 'day') {
      this.updateDayView();
    } else if (this.currentView === 'week') {
      this.updateWeekView();
    }
  }

  // Show day view (only the current date)
  updateDayView(): void {
    const startOfCurrentDay = startOfDay(this.currentDate);
    this.availableSlots = this.generateTimeSlots(startOfCurrentDay, 30); // Generate 30-minute slots for the whole day
    let serviceResponse = this.consultationService.getConsultantConsultationsByDay(101, this.currentDate);
    // let reservedSlots: Reservation[] = [];
    serviceResponse.forEach((reservation) => {
      reservation.forEach((res) => {
        // let reservedSlotsKey = format(res.slotTime, 'HH:mm');
        let reservedSlotsKey = res.slotTime;
        this.availableSlots[reservedSlotsKey] = res;
      })
    });
  }

  // Generate 30-minute time slots for the whole day
  generateTimeSlots(startDate: Date, intervalMinutes: number) {
    let slots: Record<string, Consultation | null> = {};
    let slotTime = startDate;

    const endOfDay = new Date(startDate);
    endOfDay.setHours(23, 59, 59, 999);
    // Generate slots until the end of the day
    while (slotTime <= endOfDay) {
      slots[format(slotTime, 'HH:mm')] = null;
      slotTime = addMinutes(slotTime, intervalMinutes); // Move to the next slot
    }

    return slots;
  }

  toggleSlot(slot: string): void {
    const reservation = this.availableSlots[slot];
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      data: {time: slot, reservation},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.action === 'delete') {
    //     console.log(`Deleted ${result.reservationId}`)
    //     this.consultationService.deleteReservation(result.reservationId).subscribe({
    //       next: (reservations) => this.updateCalendar(),
    //       error: (err) => console.error('Error:', err),
    //     })
    //   }
    // });
  }


  // Show week view (current week based on the current date)
  updateWeekView(): Date[] {
    const startOfCurrentWeek = startOfWeek(this.currentDate, {weekStartsOn: 0}); // Assuming Sunday is the start of the week
    const weekDays = eachDayOfInterval({start: startOfCurrentWeek, end: addDays(startOfCurrentWeek, 6)});

    return weekDays;
  }

  objectKeys(slots: {}) {
    return Object.keys(slots);
  }

  protected readonly format = format;


}
