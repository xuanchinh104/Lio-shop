import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ThemeColorBanner, ThemeColorEnum, ThemeUIEnum } from '../../dashboard.enum';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DashboardService } from '../../dashboard.service';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'ui-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
    readonly themeUIEnum = ThemeUIEnum;

    config = this.dashboardService.getConfig();
    constructor(
        private ref: NzModalRef,
        private dashboardService: DashboardService,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}

    onSelectTheme(ui: ThemeUIEnum): void {
        this.config.theme = ui;
        this.config.themeClass = ui;
    }

    onSelectTopic(img: string): void {
        this.config.topicImg = img;
    }

    onSelectThemeColor(color: ThemeColorEnum): void {
        this.config.color = color;
        this.config.banner = ThemeColorBanner[color];
    }

    onSave(): void {
        this.dashboardService.setConfig(this.config);
        this.close();
    }

    close(isLoad = true): void {
        this.ref.close(isLoad);
    }
}
