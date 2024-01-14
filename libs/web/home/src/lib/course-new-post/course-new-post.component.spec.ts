import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNewPostComponent } from './course-new-post.component';

describe('CourseNewPostComponent', () => {
    let component: CourseNewPostComponent;
    let fixture: ComponentFixture<CourseNewPostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNewPostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNewPostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
