import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotfoundTplComponent } from './notfound-tpl.component';

describe('NotfoundTplComponent', () => {
    let component: NotfoundTplComponent;
    let fixture: ComponentFixture<NotfoundTplComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotfoundTplComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotfoundTplComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
