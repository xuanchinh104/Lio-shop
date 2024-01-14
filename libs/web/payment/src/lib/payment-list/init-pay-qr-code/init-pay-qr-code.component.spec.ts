import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitPayQRCodeComponent } from './init-pay-qr-code.component';

describe('InitPayQRCodeComponent', () => {
    let component: InitPayQRCodeComponent;
    let fixture: ComponentFixture<InitPayQRCodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InitPayQRCodeComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InitPayQRCodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
