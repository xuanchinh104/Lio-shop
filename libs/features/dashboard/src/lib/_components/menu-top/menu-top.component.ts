import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ui-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuTopComponent {}
