import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSyncComponent } from './user-sync.component';

describe('UserSyncComponent', () => {
    let component: UserSyncComponent;
    let fixture: ComponentFixture<UserSyncComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserSyncComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserSyncComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
