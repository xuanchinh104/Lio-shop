import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscSpinnerComponent } from './asc-spinner.component';

describe('AscSpinnerComponent', () => {
    let component: AscSpinnerComponent;
    let fixture: ComponentFixture<AscSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AscSpinnerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AscSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
