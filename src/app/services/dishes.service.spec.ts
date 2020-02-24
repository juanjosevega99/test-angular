import { TestBed } from '@angular/core/testing';

import { DishesService } from './dishes.service';

describe('DishesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishesService = TestBed.get(DishesService);
    expect(service).toBeTruthy();
  });
});
