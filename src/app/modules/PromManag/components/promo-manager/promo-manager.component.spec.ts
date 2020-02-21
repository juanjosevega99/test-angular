import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoManagerComponent } from './promo-manager.component';

describe('PromoManagerComponent', () => {
  let component: PromoManagerComponent;
  let fixture: ComponentFixture<PromoManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
