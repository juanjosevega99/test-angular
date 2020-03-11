import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccompanimentsComponent } from './accompaniments.component';

describe('AccompanimentsComponent', () => {
  let component: AccompanimentsComponent;
  let fixture: ComponentFixture<AccompanimentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccompanimentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccompanimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
