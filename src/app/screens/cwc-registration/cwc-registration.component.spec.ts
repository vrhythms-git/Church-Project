import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwcRegistrationComponent } from './cwc-registration.component';

describe('CwcRegistrationComponent', () => {
  let component: CwcRegistrationComponent;
  let fixture: ComponentFixture<CwcRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CwcRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CwcRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
