import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionToRoleDepartmentComponent } from './add-permission-to-role-department.component';

describe('AddPermissionToRoleDepartmentComponent', () => {
    let component: AddPermissionToRoleDepartmentComponent;
    let fixture: ComponentFixture<AddPermissionToRoleDepartmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPermissionToRoleDepartmentComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPermissionToRoleDepartmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
