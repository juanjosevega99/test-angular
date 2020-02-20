import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForgetComponent } from './login-forget.component';

describe('LoginForgetComponent', () => {
  let component: LoginForgetComponent;
  let fixture: ComponentFixture<LoginForgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginForgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
