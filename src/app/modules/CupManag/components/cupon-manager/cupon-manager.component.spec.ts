import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponManagerComponent } from './cupon-manager.component';

describe('CuponManagerComponent', () => {
  let component: CuponManagerComponent;
  let fixture: ComponentFixture<CuponManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
