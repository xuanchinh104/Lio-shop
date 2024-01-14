import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigReportAddFastComponent } from './config-report-add-fast.component';

describe('ConfigReportAddFastComponent', () => {
  let component: ConfigReportAddFastComponent;
  let fixture: ComponentFixture<ConfigReportAddFastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigReportAddFastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigReportAddFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
