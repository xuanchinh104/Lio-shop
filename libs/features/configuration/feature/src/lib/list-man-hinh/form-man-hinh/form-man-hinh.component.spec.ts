import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManHinhComponent } from './form-man-hinh.component';

describe('FormManHinhComponent', () => {
    let component: FormManHinhComponent;
    let fixture: ComponentFixture<FormManHinhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormManHinhComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormManHinhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
