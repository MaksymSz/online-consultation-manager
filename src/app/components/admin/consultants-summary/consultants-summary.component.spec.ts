import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantsSummaryComponent } from './consultants-summary.component';

describe('ConsultantsSummaryComponent', () => {
  let component: ConsultantsSummaryComponent;
  let fixture: ComponentFixture<ConsultantsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultantsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
