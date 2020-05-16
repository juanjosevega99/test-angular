import { TestBed } from '@angular/core/testing';

import { FrequentQuestionsService } from './frequent-questions.service';

describe('FrequentQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrequentQuestionsService = TestBed.get(FrequentQuestionsService);
    expect(service).toBeTruthy();
  });
});
