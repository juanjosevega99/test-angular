import { TestBed } from '@angular/core/testing';

import { OrderRecordsByUserService } from './order-records-by-user.service';

describe('OrderRecordsByUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderRecordsByUserService = TestBed.get(OrderRecordsByUserService);
    expect(service).toBeTruthy();
  });
});
