import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSettingComponent } from './dropdown-setting.component';

describe('DropdownSettingComponent', () => {
    let component: DropdownSettingComponent;
    let fixture: ComponentFixture<DropdownSettingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DropdownSettingComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownSettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
