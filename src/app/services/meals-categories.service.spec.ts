import { TestBed } from '@angular/core/testing';

import { MealsCategoriesService } from './meals-categories.service';

describe('MealsCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MealsCategoriesService = TestBed.get(MealsCategoriesService);
    expect(service).toBeTruthy();
  });
});
