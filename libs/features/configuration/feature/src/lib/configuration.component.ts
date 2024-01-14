import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'asc-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {}
