import {Component, OnInit} from '@angular/core';
import {
  addDays,
  addMinutes,
  addWeeks,
  eachDayOfInterval,
  format,
  startOfDay,
  startOfWeek,
  subDays,
  subSeconds,
  subWeeks
} from 'date-fns';
import {CommonModule} from '@angular/common';
import {Reservation} from '../../../models/reservation';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';

import {MatDialog} from '@angular/material/dialog';
import {SlotDialogComponent} from '../../slot-dialog/slot-dialog.component';
import {MatButton} from '@angular/material/button';
import {catchError, combineLatest, forkJoin, map, Observable, of} from 'rxjs';
import {PatientsService} from '../../../services/patients.service';

@Component({
  selector: 'patient-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, MatButton],
})
export class CalendarComponent implements OnInit {
  currentView: string = 'week'; // Can be 'week' or 'day'
  currentDate: Date = new Date(); // Initial date is the current date
  availableSlots: Record<string, Reservation | null> = {}; // Stores available slots for the day
  reservedSlots: Set<string> = new Set(); // Set to track reserved slots
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  dayWeekSlots: any;

  constructor(private dialog: MatDialog,
              private patientsService: PatientsService) {
  }

  ngOnInit(): void {
    this.updateWeekView();
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
      this.updateWeekView();
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
    let serviceResponse = this.patientsService.getPatientReservationsByDay(this.currentDate);
    serviceResponse.forEach((reservation) => {
      reservation.forEach((res) => {
        let reservedSlotsKey = format(res.date, 'HH:mm');
        this.availableSlots[reservedSlotsKey] = res;
      })
    });
  }

  // Generate 30-minute time slots for the whole day
  generateTimeSlots(startDate: Date, intervalMinutes: number) {
    let slots: Record<string, Reservation | null> = {};
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

  toggleSlot(slot: any, reservation_: any): void {
    let reservation: Reservation | null = null;
    if (!reservation_) {
      reservation = this.availableSlots[slot];
    } else {
      reservation = reservation_;
    }
    const dialogRef = this.dialog.open(SlotDialogComponent, {
      data: {time: slot, reservation},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        // self.document.getElementById()
        // console.log()
        const dateKey = startOfDay(result.reservation.date)
        let dayKey = dateKey.getDay() - 1
        if (dayKey === -1) {
          dayKey = 0
        }

        this.dayWeekSlots[dayKey][1][1][result.time] = null

        console.log(`Deleted ${result.reservation.id}`)
        this.patientsService.deleteReservation(result.reservation.id);
      }
    });
  }

  getSlotClass(slot: any, xx_: any, day_: any): string {
    let xx;
    // console.log(day_)
    if (!xx_) {
      xx = this.availableSlots[slot];
    } else {
      xx = xx_;
    }

    let className = '';
    const now = new Date();
    const yy = slot.split(':');
    let rangeLow = this.currentDate;
    if (day_) {
      rangeLow = day_;
    }
    rangeLow.setHours(yy[0], yy[1], 0);

    const rangeHigh = subSeconds(addMinutes(rangeLow, 30), 1);

    if (rangeHigh < now) {
      className += 'past ';
    } else if (rangeLow <= now && now < rangeHigh) {
      className += 'present '
    }

    if (!xx) {
      className += 'available';

      return className;
    }
    // @ts-ignore
    if (xx.canceled) {
      className += 'canceled';

      return className;
    }
    // @ts-ignore
    className += xx.genre.toLowerCase().replace(' ', '-');

    return className;
  }

  test() {

  }

  weekHeader(): string {
    const startOfCurrentWeek = startOfWeek(this.currentDate, {weekStartsOn: 1}); // Assuming Monday is the start of the week
    const weekDays = eachDayOfInterval({start: startOfCurrentWeek, end: addDays(startOfCurrentWeek, 6)}); //this.dayWeekSlots;
    const format_format = 'MMMM dd, yyyy';
    const from = format(weekDays[0], format_format);
    const to = format(weekDays[6], format_format);

    return 'from ' + from + ' to ' + to;
  }

  updateWeekView() {
    const startOfCurrentWeek = startOfWeek(this.currentDate, {weekStartsOn: 1}); // Assuming Monday is the start of the week
    const weekDays = eachDayOfInterval({start: startOfCurrentWeek, end: addDays(startOfCurrentWeek, 6)});


    const weekDayObservables = weekDays.map(
      (day) => this.weekDayInfo(day)
        .pipe(map((slots) => [day, slots])));

    combineLatest(weekDayObservables).subscribe({
      next: (results) => {
        this.dayWeekSlots = results; // Each result is [day, slots]
      },
      error: (err) => {
        console.error("Failed to fetch week data:", err);
      },
    });
  }


  weekDayInfo(day: Date) {
    const startOfCurrentDay = startOfDay(day);
    let availableSlots: Record<string, Reservation | null> = {};
    availableSlots = this.generateTimeSlots(startOfCurrentDay, 30);

    return this.patientsService.getPatientReservationsByDay(day).pipe(
      map((response) => {
        response.forEach((res) => {
          if (res.date) {
            let reservedSlotsKey = format(new Date(res.date), 'HH:mm');
            availableSlots[reservedSlotsKey] = res;
          }
        });
        return [day, availableSlots] as [Date, Record<string, Reservation | null>];
      }),
      catchError((error) => {
        // console.error(`Error fetching reservations for ${day}:`, error);
        return of([day, availableSlots]);
      })
    );
  }


  objectKeys(slots: {}) {
    return Object.keys(slots);
  }

  protected readonly format = format;


  protected readonly addDays = addDays;
}
