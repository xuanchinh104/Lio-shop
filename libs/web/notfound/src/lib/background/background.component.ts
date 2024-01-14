import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'asc-background',
    templateUrl: './background.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent {}
