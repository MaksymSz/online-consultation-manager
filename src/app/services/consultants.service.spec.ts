import { TestBed } from '@angular/core/testing';

import { ConsultantsService } from './consultants.service';

describe('ConsultantsService', () => {
  let service: ConsultantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
