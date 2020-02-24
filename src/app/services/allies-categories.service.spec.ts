import { TestBed } from '@angular/core/testing';

import { AlliesCategoriesService } from './allies-categories.service';

describe('AlliesCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlliesCategoriesService = TestBed.get(AlliesCategoriesService);
    expect(service).toBeTruthy();
  });
});
