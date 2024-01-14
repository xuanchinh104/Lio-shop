import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhomManHinhComponent } from './nhom-man-hinh.component';

describe('NhomManHinhComponent', () => {
    let component: NhomManHinhComponent;
    let fixture: ComponentFixture<NhomManHinhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NhomManHinhComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NhomManHinhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
