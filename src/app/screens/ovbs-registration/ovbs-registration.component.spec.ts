import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvbsRegistrationComponent } from './ovbs-registration.component';

describe('OvbsRegistrationComponent', () => {
  let component: OvbsRegistrationComponent;
  let fixture: ComponentFixture<OvbsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvbsRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OvbsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
