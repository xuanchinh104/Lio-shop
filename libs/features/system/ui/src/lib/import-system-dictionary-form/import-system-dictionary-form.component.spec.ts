import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSystemDictionaryFormComponent } from './import-system-dictionary-form.component';

describe('ImportSystemDictionaryFormComponent', () => {
  let component: ImportSystemDictionaryFormComponent;
  let fixture: ComponentFixture<ImportSystemDictionaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSystemDictionaryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSystemDictionaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
