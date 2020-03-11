import { TestBed } from '@angular/core/testing';

import { LoadImagesService } from './load-images.service';

describe('LoadImagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadImagesService = TestBed.get(LoadImagesService);
    expect(service).toBeTruthy();
  });
});
