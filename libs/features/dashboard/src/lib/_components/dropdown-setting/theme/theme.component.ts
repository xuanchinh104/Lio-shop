import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'ui-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeComponent {
    theme = '';

    constructor(private modal: NzModalService, private translocoService: TranslocoService) {}

    onSelectTheme(): void {
        this.modal.create({
            nzTitle: this.translocoService.translate('LB.CHOOSE_THEME'),
            nzContent: LayoutComponent,
            nzWrapClassName: 'change-theme',
            nzComponentParams: {},
            nzFooter: null,
            nzMaskClosable: false,
        });
    }
}
