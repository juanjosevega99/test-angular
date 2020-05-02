import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsOrdersComponent } from './notifications-orders.component';

describe('NotificationsOrdersComponent', () => {
  let component: NotificationsOrdersComponent;
  let fixture: ComponentFixture<NotificationsOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
