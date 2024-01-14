import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNewDetailComponent } from './course-new-detail.component';

describe('CourseNewDetailComponent', () => {
    let component: CourseNewDetailComponent;
    let fixture: ComponentFixture<CourseNewDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNewDetailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNewDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
