import { TestBed } from '@angular/core/testing';

import { ProfilesCategoriesService } from './profiles-categories.service';

describe('ProfilesCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilesCategoriesService = TestBed.get(ProfilesCategoriesService);
    expect(service).toBeTruthy();
  });
});
