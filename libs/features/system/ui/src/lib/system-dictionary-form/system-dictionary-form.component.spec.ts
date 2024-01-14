import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDictionaryFormComponent } from './system-dictionary-form.component';

describe('SystemDictionaryFormComponent', () => {
  let component: SystemDictionaryFormComponent;
  let fixture: ComponentFixture<SystemDictionaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemDictionaryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDictionaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
