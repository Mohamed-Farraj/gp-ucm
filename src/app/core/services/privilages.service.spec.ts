import { TestBed } from '@angular/core/testing';

import { PrivilagesService } from './privilages.service';

describe('PrivilagesService', () => {
  let service: PrivilagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
