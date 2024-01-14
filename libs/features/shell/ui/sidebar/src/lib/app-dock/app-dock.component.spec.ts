import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDockComponent } from './app-dock.component';

describe('AppDockComponent', () => {
    let component: AppDockComponent;
    let fixture: ComponentFixture<AppDockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppDockComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppDockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
