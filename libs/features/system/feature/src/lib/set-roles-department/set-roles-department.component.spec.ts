import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRolesDepartmentComponent } from './set-roles-department.component';

describe('SetRolesDepartmentComponent', () => {
    let component: SetRolesDepartmentComponent;
    let fixture: ComponentFixture<SetRolesDepartmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetRolesDepartmentComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SetRolesDepartmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
