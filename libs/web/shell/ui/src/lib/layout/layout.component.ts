import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingService } from '@asc/web/shell/data-access/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        query(':leave', [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))], { optional: true }),
        query(':enter', [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))], { optional: true }),
    ]),
]);

export const fader = trigger('routeAnimations', [
    transition('* <=> *', [
        // Set a default  style for enter and leave
        query(':enter, :leave', [
            style({
                position: 'absolute',
                left: 0,
                width: '100%',
                opacity: 0,
                transform: 'scale(0) translateY(100%)',
            }),
        ]),
        // Animate the new page in
        query(':enter', [animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))]),
    ]),
]);

@Component({
    selector: 'asc-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    animations: [fadeAnimation],
})
export class LayoutComponent implements OnInit, OnDestroy {
    private destroyed$ = new Subject();
    constructor(private settingService: SettingService) {}

    ngOnInit(): void {
        this.settingService.getConfigWeb().pipe(takeUntil(this.destroyed$)).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
