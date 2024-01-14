import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomListNewComponent } from './classroom-list-new.component';

describe('ClassroomListNewComponent', () => {
    let component: ClassroomListNewComponent;
    let fixture: ComponentFixture<ClassroomListNewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClassroomListNewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassroomListNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
