import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChucNangComponent } from './list-chuc-nang.component';

describe('ListChucNangComponent', () => {
    let component: ListChucNangComponent;
    let fixture: ComponentFixture<ListChucNangComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListChucNangComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListChucNangComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
