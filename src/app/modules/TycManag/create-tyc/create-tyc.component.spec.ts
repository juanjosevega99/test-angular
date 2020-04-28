import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTycComponent } from './create-tyc.component';

describe('CreateTycComponent', () => {
  let component: CreateTycComponent;
  let fixture: ComponentFixture<CreateTycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
