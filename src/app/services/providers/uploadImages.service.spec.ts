import { TestBed } from '@angular/core/testing';

import { UploadImagesService } from './uploadImages.service';

describe('UploadImagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadImagesService = TestBed.get(UploadImagesService);
    expect(service).toBeTruthy();
  });
});
