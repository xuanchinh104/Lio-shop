import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { KeyConfigWeb } from '@asc/web/shell/data-access/constant';
import { SettingService } from '@asc/web/shell/data-access/service';
import { map } from 'rxjs/operators';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    logo$ = this.settingService.getValueByKey(KeyConfigWeb.LOGO);
    title$ = this.settingService.getValueByKey(KeyConfigWeb.FOOTER_TITLE);

    footerContents$ = this.settingService.getValueByKey(KeyConfigWeb.FOOTER_CONTENT).pipe(
        map(rs => {
            if (rs) {
                return JSON.parse(rs);
            }

            return [];
        })
    );

    footerLink$ = this.settingService.getValueByKey(KeyConfigWeb.FOOTER_LINK).pipe(
        map(rs => {
            if (rs) {
                return JSON.parse(rs);
            }

            return [];
        })
    );

    footerSocial$ = this.settingService.getValueByKey(KeyConfigWeb.FOOTER_SOCIAL).pipe(
        map(rs => {
            if (rs) {
                return JSON.parse(rs);
            }

            return [];
        })
    );

    mediaServer = this.env.mediaServer;

    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private settingService: SettingService) {}
}
