import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreUploadInputComponent } from './score-upload-input.component';

describe('ScoreUploadInputComponent', () => {
  let component: ScoreUploadInputComponent;
  let fixture: ComponentFixture<ScoreUploadInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreUploadInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreUploadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
