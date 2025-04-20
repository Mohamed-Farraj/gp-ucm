import { TestBed } from '@angular/core/testing';

import { ArService } from './ar.service';

describe('ArService', () => {
  let service: ArService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
