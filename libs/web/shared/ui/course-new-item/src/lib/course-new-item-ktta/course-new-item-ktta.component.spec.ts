import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNewItemKttaComponent } from './course-new-item-ktta.component';

describe('CourseNewItemKttaComponent', () => {
    let component: CourseNewItemKttaComponent;
    let fixture: ComponentFixture<CourseNewItemKttaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseNewItemKttaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseNewItemKttaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
