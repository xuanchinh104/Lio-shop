import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'ui-dropdown-setting',
    templateUrl: './dropdown-setting.component.html',
    styleUrls: ['./dropdown-setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSettingComponent {
    @Input() classOverlay = '';
}
