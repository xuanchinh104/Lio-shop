import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePostDetailComponent } from './course-post-detail.component';

describe('CoursePostDetailComponent', () => {
    let component: CoursePostDetailComponent;
    let fixture: ComponentFixture<CoursePostDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoursePostDetailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursePostDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
