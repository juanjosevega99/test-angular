import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPqrsComponent } from './notifications-pqrs.component';

describe('NotificationsPqrsComponent', () => {
  let component: NotificationsPqrsComponent;
  let fixture: ComponentFixture<NotificationsPqrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsPqrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
