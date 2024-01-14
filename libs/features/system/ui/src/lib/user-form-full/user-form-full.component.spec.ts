import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormFullComponent } from './user-form-full.component';

describe('UserFormFullComponent', () => {
    let component: UserFormFullComponent;
    let fixture: ComponentFixture<UserFormFullComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserFormFullComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserFormFullComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
