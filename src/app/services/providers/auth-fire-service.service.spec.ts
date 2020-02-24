import { TestBed } from '@angular/core/testing';

import { AuthFireServiceService } from './auth-fire-service.service';

describe('AuthFireServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthFireServiceService = TestBed.get(AuthFireServiceService);
    expect(service).toBeTruthy();
  });
});
