import { TestBed } from '@angular/core/testing';

import { CouponsAvailableService } from './coupons-available.service';

describe('CouponsAvailableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CouponsAvailableService = TestBed.get(CouponsAvailableService);
    expect(service).toBeTruthy();
  });
});
