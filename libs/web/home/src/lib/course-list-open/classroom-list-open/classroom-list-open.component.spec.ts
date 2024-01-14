import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomListOpenComponent } from './classroom-list-open.component';

describe('ClassroomListOpenComponent', () => {
    let component: ClassroomListOpenComponent;
    let fixture: ComponentFixture<ClassroomListOpenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClassroomListOpenComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassroomListOpenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
