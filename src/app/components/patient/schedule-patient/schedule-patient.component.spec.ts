import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePatientComponent } from './schedule-patient.component';

describe('SchedulePatientComponent', () => {
  let component: SchedulePatientComponent;
  let fixture: ComponentFixture<SchedulePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
