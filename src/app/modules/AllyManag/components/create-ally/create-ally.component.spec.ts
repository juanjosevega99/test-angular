import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAllyComponent } from './create-ally.component';

describe('CreateAllyComponent', () => {
  let component: CreateAllyComponent;
  let fixture: ComponentFixture<CreateAllyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAllyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAllyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
