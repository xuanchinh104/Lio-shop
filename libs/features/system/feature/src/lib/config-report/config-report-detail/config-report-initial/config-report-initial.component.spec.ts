import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigReportInitialComponent } from './config-report-initial.component';

describe('ConfigReportInitialComponent', () => {
  let component: ConfigReportInitialComponent;
  let fixture: ComponentFixture<ConfigReportInitialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigReportInitialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigReportInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
