import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseItemGroupComponent } from './course-item-group.component';

describe('CourseItemGroupComponent', () => {
    let component: CourseItemGroupComponent;
    let fixture: ComponentFixture<CourseItemGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseItemGroupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseItemGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
