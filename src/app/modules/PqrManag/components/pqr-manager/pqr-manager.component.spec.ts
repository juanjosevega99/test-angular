import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PqrManagerComponent } from './pqr-manager.component';

describe('PqrManagerComponent', () => {
  let component: PqrManagerComponent;
  let fixture: ComponentFixture<PqrManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PqrManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PqrManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
