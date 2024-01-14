import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNhomManHinhComponent } from './form-nhom-man-hinh.component';

describe('FormNhomManHinhComponent', () => {
    let component: FormNhomManHinhComponent;
    let fixture: ComponentFixture<FormNhomManHinhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormNhomManHinhComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormNhomManHinhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
