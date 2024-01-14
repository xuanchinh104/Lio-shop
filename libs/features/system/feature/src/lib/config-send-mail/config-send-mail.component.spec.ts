import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSendMailComponent } from './config-send-mail.component';

describe('ConfigSendMailComponent', () => {
    let component: ConfigSendMailComponent;
    let fixture: ComponentFixture<ConfigSendMailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfigSendMailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigSendMailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
