import { TestBed } from '@angular/core/testing';

import { ChargesService } from './charges.service';

describe('ChargesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargesService = TestBed.get(ChargesService);
    expect(service).toBeTruthy();
  });
});
