import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResestPasswordComponent } from './resest-password.component';

describe('ResestPasswordComponent', () => {
  let component: ResestPasswordComponent;
  let fixture: ComponentFixture<ResestPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResestPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResestPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
