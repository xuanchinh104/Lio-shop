import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRolesUserComponent } from './set-roles-user.component';

describe('SetRolesUserComponent', () => {
    let component: SetRolesUserComponent;
    let fixture: ComponentFixture<SetRolesUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetRolesUserComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SetRolesUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
