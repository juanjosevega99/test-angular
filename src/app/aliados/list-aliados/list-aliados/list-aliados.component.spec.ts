import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAliadosComponent } from './list-aliados.component';

describe('ListAliadosComponent', () => {
  let component: ListAliadosComponent;
  let fixture: ComponentFixture<ListAliadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAliadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
