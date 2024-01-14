import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListOpenComponent } from './course-list-open.component';

describe('CourseListOpenComponent', () => {
    let component: CourseListOpenComponent;
    let fixture: ComponentFixture<CourseListOpenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseListOpenComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseListOpenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
