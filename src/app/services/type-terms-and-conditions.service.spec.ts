import { TestBed } from '@angular/core/testing';

import { TypeTermsAndConditionsService } from './type-terms-and-conditions.service';

describe('TypeTermsAndConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeTermsAndConditionsService = TestBed.get(TypeTermsAndConditionsService);
    expect(service).toBeTruthy();
  });
});
