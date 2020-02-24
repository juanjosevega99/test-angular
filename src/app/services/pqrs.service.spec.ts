import { TestBed } from '@angular/core/testing';

import { PqrsService } from './pqrs.service';

describe('PqrsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PqrsService = TestBed.get(PqrsService);
    expect(service).toBeTruthy();
  });
});
