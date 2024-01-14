import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPermissionComponent } from './grid-permission.component';

describe('GridPermissionComponent', () => {
    let component: GridPermissionComponent;
    let fixture: ComponentFixture<GridPermissionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GridPermissionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridPermissionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
