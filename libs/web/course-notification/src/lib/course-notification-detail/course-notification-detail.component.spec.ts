import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNotificationDetailComponent } from './course-notification-detail.component';

describe('CourseNotificationDetailComponent', () => {
    let component: CourseNotificationDetailComponent;
    let fixture: ComponentFixture<CourseNotificationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNotificationDetailComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNotificationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
