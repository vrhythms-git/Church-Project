import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreUploadComponent } from './score-upload.component';

describe('ScoreUploadComponent', () => {
  let component: ScoreUploadComponent;
  let fixture: ComponentFixture<ScoreUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
