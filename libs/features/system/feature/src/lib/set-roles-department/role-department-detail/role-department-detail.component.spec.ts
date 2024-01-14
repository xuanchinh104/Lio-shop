import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDepartmentDetailComponent } from './role-department-detail.component';

describe('RoleDepartmentDetailComponent', () => {
    let component: RoleDepartmentDetailComponent;
    let fixture: ComponentFixture<RoleDepartmentDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoleDepartmentDetailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleDepartmentDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
