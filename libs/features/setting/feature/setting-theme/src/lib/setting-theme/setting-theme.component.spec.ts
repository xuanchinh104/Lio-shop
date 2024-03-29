/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingThemeComponent } from './setting-theme.component';

describe('SettingThemeComponent', () => {
    let component: SettingThemeComponent;
    let fixture: ComponentFixture<SettingThemeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingThemeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingThemeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
