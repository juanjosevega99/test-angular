import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllyManagerComponent } from './ally-manager.component';

describe('AllyManagerComponent', () => {
  let component: AllyManagerComponent;
  let fixture: ComponentFixture<AllyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllyManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
