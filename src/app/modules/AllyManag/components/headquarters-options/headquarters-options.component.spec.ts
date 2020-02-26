import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersOptionsComponent } from './headquarters-options.component';

describe('HeadquartersOptionsComponent', () => {
  let component: HeadquartersOptionsComponent;
  let fixture: ComponentFixture<HeadquartersOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadquartersOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquartersOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
