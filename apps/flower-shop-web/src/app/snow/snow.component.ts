import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'asc-snow',
    templateUrl: './snow.component.html',
    styleUrls: ['./snow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnowComponent {}
