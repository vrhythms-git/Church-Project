import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomaExamRegistrationComponent } from './diploma-exam-registration.component';

describe('DiplomaExamRegistrationComponent', () => {
  let component: DiplomaExamRegistrationComponent;
  let fixture: ComponentFixture<DiplomaExamRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiplomaExamRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiplomaExamRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
