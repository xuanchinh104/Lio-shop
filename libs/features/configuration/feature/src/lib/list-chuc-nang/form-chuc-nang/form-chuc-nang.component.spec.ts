import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChucNangComponent } from './form-chuc-nang.component';

describe('FormChucNangComponent', () => {
    let component: FormChucNangComponent;
    let fixture: ComponentFixture<FormChucNangComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormChucNangComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormChucNangComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
