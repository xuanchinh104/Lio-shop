import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseItemKttaComponent } from './course-item-ktta.component';

describe('CourseItemKttaComponent', () => {
    let component: CourseItemKttaComponent;
    let fixture: ComponentFixture<CourseItemKttaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseItemKttaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseItemKttaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
