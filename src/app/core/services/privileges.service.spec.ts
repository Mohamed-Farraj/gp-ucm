import { TestBed } from '@angular/core/testing';

import { PrivilegesService } from './privileges.service';

describe('PrivilegesService', () => {
  let service: PrivilegesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilegesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
