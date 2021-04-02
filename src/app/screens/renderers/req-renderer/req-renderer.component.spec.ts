import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqRendererComponent } from './req-renderer.component';

describe('ReqRendererComponent', () => {
  let component: ReqRendererComponent;
  let fixture: ComponentFixture<ReqRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
