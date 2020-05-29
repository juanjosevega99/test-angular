import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFrequentQuestionsComponent } from './create-frequent-questions.component';

describe('CreateFrequentQuestionsComponent', () => {
  let component: CreateFrequentQuestionsComponent;
  let fixture: ComponentFixture<CreateFrequentQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFrequentQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFrequentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
