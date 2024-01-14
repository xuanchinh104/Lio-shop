import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManHinhComponent } from './list-man-hinh.component';

describe('ListManHinhComponent', () => {
    let component: ListManHinhComponent;
    let fixture: ComponentFixture<ListManHinhComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListManHinhComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListManHinhComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
