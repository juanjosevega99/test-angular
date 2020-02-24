import { TestBed } from '@angular/core/testing';

import { AccompanimentsService } from './accompaniments.service';

describe('AccompanimentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccompanimentsService = TestBed.get(AccompanimentsService);
    expect(service).toBeTruthy();
  });
});
