import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContentMailComponent } from './config-content-mail.component';

describe('ConfigContentMailComponent', () => {
    let component: ConfigContentMailComponent;
    let fixture: ComponentFixture<ConfigContentMailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfigContentMailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigContentMailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
