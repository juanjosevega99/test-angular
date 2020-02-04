import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSedesComponent } from './list-sedes.component';

describe('ListSedesComponent', () => {
  let component: ListSedesComponent;
  let fixture: ComponentFixture<ListSedesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSedesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
