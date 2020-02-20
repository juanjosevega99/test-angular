import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TycManagerComponent } from './tyc-manager.component';

describe('TycManagerComponent', () => {
  let component: TycManagerComponent;
  let fixture: ComponentFixture<TycManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TycManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TycManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
