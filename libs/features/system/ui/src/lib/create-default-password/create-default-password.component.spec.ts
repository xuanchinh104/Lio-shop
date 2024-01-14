import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDefaultPasswordComponent } from './create-default-password.component';

describe('CreateDefaultPasswordComponent', () => {
    let component: CreateDefaultPasswordComponent;
    let fixture: ComponentFixture<CreateDefaultPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateDefaultPasswordComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDefaultPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
