import { TestBed } from '@angular/core/testing';

import { DishesCategoriesService } from './dishes-categories.service';

describe('DishesCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishesCategoriesService = TestBed.get(DishesCategoriesService);
    expect(service).toBeTruthy();
  });
});
