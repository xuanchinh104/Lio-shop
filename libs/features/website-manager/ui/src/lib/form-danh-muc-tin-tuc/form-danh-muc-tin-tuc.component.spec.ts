import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDanhMucTinTucComponent } from './form-danh-muc-tin-tuc.component';

describe('FormDanhMucTinTucComponent', () => {
    let component: FormDanhMucTinTucComponent;
    let fixture: ComponentFixture<FormDanhMucTinTucComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormDanhMucTinTucComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormDanhMucTinTucComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
