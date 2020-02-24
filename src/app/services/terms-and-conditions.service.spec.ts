import { TestBed } from '@angular/core/testing';

import { TermsAndConditionsService } from './terms-and-conditions.service';

describe('TermsAndConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TermsAndConditionsService = TestBed.get(TermsAndConditionsService);
    expect(service).toBeTruthy();
  });
});
