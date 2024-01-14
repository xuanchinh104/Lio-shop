import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDepartmentListComponent } from './role-department-list.component';

describe('RoleDepartmentListComponent', () => {
    let component: RoleDepartmentListComponent;
    let fixture: ComponentFixture<RoleDepartmentListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoleDepartmentListComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleDepartmentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
