import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeUI, ThemeUIEnum } from '../../../dashboard.enum';
import { ConfigUI } from '../../../_models/config-ui.model';

@Component({
    selector: 'ui-sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleComponent {
    configUI: ConfigUI | null = null;
    @Input() set config(value: ConfigUI) {
        this.configUI = value;
        console.warn(this.configUI);
    }

    themeUIBackgrounds = ThemeUI;
    themeUIEnum = ThemeUIEnum;
    themeUIs = [ThemeUIEnum.THEME_1, ThemeUIEnum.THEME_2];

    @Output() selectTheme = new EventEmitter();

    onSelectTheme(ui: ThemeUIEnum): void {
        this.selectTheme.emit(ui);
    }
}
