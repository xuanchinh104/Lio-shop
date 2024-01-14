import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigReportComponent } from './form-config-report.component';

describe('FormConfigReportComponent', () => {
  let component: FormConfigReportComponent;
  let fixture: ComponentFixture<FormConfigReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConfigReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfigReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
