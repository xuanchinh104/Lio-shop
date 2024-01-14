import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigReportDetailComponent } from './config-report-detail.component';

describe('ConfigReportDetailComponent', () => {
  let component: ConfigReportDetailComponent;
  let fixture: ComponentFixture<ConfigReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
