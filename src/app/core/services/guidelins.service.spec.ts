import { TestBed } from '@angular/core/testing';

import { GuidelinsService } from './guidelins.service';

describe('GuidelinsService', () => {
  let service: GuidelinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuidelinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
