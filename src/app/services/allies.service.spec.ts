import { TestBed } from '@angular/core/testing';

import { AlliesService } from './allies.service';

describe('AlliesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlliesService = TestBed.get(AlliesService);
    expect(service).toBeTruthy();
  });
});
