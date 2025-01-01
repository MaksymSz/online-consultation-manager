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
import {Reservation} from '../models/reservation';
import {ReservationService} from '../services/reservations';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule],
})
export class CalendarComponent implements OnInit {
  currentView: string = 'week'; // Can be 'week' or 'day'
  currentDate: Date = new Date(); // Initial date is the current date
  availableSlots: Record<string, Reservation | null> = {}; // Stores available slots for the day
  reservedSlots: Set<string> = new Set(); // Set to track reserved slots
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private reservationService: ReservationService,) {
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
    let reservedSlots = this.reservationService.getPatientReservationsByDay(101, this.currentDate);
    reservedSlots.forEach((reservation: Reservation) => {
      let reservedSlotsKey = format(reservation.date, 'HH:mm');
      this.availableSlots[reservedSlotsKey] = reservation;
    })
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

  // Toggle the reserved status of a slot
  toggleSlot(slot: string): void {
    if (this.reservedSlots.has(slot)) {
      this.reservedSlots.delete(slot); // Unreserve
    } else {
      this.reservedSlots.add(slot); // Reserve
    }
    console.log(`Reserved slots:`, Array.from(this.reservedSlots));
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
