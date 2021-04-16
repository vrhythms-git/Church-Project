import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwcregistrationComponent } from './cwcregistration.component';

describe('CwcregistrationComponent', () => {
  let component: CwcregistrationComponent;
  let fixture: ComponentFixture<CwcregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CwcregistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CwcregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
