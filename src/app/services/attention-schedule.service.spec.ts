import { TestBed } from '@angular/core/testing';

import { AttentionScheduleService } from './attention-schedule.service';

describe('AttentionScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttentionScheduleService = TestBed.get(AttentionScheduleService);
    expect(service).toBeTruthy();
  });
});
