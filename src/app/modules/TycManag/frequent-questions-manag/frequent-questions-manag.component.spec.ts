import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentQuestionsManagComponent } from './frequent-questions-manag.component';

describe('FrequentQuestionsManagComponent', () => {
  let component: FrequentQuestionsManagComponent;
  let fixture: ComponentFixture<FrequentQuestionsManagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentQuestionsManagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentQuestionsManagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
