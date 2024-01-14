import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePostItemComponent } from './course-post-item.component';

describe('CoursePostItemComponent', () => {
    let component: CoursePostItemComponent;
    let fixture: ComponentFixture<CoursePostItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CoursePostItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursePostItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
