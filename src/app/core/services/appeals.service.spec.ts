import { TestBed } from '@angular/core/testing';

import { AppealsService } from './appeals.service';

describe('AppealsService', () => {
  let service: AppealsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppealsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
