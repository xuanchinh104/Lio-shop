import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDepartmentListComponent } from './user-department-list.component';

describe('UserDepartmentListComponent', () => {
    let component: UserDepartmentListComponent;
    let fixture: ComponentFixture<UserDepartmentListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserDepartmentListComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDepartmentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
