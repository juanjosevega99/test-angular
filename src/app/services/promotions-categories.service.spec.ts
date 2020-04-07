import { TestBed } from '@angular/core/testing';

import { PromotionsCategoriesService } from './promotions-categories.service';

describe('PromotionsCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PromotionsCategoriesService = TestBed.get(PromotionsCategoriesService);
    expect(service).toBeTruthy();
  });
});
