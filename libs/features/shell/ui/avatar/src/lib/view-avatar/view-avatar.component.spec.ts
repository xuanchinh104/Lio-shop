import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAvatarComponent } from './view-avatar.component';

describe('ViewAvatarComponent', () => {
  let component: ViewAvatarComponent;
  let fixture: ComponentFixture<ViewAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
