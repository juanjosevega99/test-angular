import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHeadquarterComponent } from './create-headquarter.component';

describe('CreateHeadquarterComponent', () => {
  let component: CreateHeadquarterComponent;
  let fixture: ComponentFixture<CreateHeadquarterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHeadquarterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
