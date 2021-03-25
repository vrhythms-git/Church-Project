import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtcRegistrationComponent } from './ttc-registration.component';

describe('TtcRegistrationComponent', () => {
  let component: TtcRegistrationComponent;
  let fixture: ComponentFixture<TtcRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TtcRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TtcRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
