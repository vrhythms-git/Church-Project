import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreReviewComponent } from './score-review.component';

describe('ScoreReviewComponent', () => {
  let component: ScoreReviewComponent;
  let fixture: ComponentFixture<ScoreReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
