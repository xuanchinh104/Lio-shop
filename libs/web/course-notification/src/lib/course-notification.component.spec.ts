import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNotificationComponent } from './course-notification.component';

describe('CourseNotificationComponent', () => {
    let component: CourseNotificationComponent;
    let fixture: ComponentFixture<CourseNotificationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNotificationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
