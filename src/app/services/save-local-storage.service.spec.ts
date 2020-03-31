import { TestBed } from '@angular/core/testing';

import { SaveLocalStorageService } from './save-local-storage.service';

describe('SaveLocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveLocalStorageService = TestBed.get(SaveLocalStorageService);
    expect(service).toBeTruthy();
  });
});
