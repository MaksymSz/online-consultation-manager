import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaCalendarComponent } from './meta-calendar.component';

describe('MetaCalendarComponent', () => {
  let component: MetaCalendarComponent;
  let fixture: ComponentFixture<MetaCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetaCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
