import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAliadoComponent } from './menu-aliado.component';

describe('MenuAliadoComponent', () => {
  let component: MenuAliadoComponent;
  let fixture: ComponentFixture<MenuAliadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAliadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
