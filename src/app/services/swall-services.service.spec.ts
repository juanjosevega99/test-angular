import { TestBed } from '@angular/core/testing';

import { SwallServicesService } from './swall-services.service';

describe('SwallServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwallServicesService = TestBed.get(SwallServicesService);
    expect(service).toBeTruthy();
  });
});
