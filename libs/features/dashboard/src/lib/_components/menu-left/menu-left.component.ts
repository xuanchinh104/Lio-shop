import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ui-menu-left',
    templateUrl: './menu-left.component.html',
    styleUrls: ['./menu-left.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLeftComponent {}
