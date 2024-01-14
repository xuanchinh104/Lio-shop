import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOfRoleComponent } from './users-of-role.component';

describe('UsersOfRoleComponent', () => {
    let component: UsersOfRoleComponent;
    let fixture: ComponentFixture<UsersOfRoleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UsersOfRoleComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersOfRoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
