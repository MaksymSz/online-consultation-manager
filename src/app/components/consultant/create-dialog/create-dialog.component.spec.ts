import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDialogComponent } from './create-dialog.component';

describe('SlotDialogComponent', () => {
  let component: CreateDialogComponent;
  let fixture: ComponentFixture<CreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
