import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNewBlogComponent } from './course-new-blog.component';

describe('CourseNewBlogComponent', () => {
    let component: CourseNewBlogComponent;
    let fixture: ComponentFixture<CourseNewBlogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNewBlogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNewBlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
