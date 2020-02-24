import { TestBed } from '@angular/core/testing';

import { AdditionalServicesService } from './additional-services.service';

describe('AdditionalServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdditionalServicesService = TestBed.get(AdditionalServicesService);
    expect(service).toBeTruthy();
  });
});
