import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAccListComponent } from './login-acc-list.component';

describe('LoginAccListComponent', () => {
  let component: LoginAccListComponent;
  let fixture: ComponentFixture<LoginAccListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAccListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAccListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
