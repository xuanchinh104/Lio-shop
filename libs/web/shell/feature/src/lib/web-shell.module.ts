import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { WebShellUIModule } from '@asc/web/shell/ui';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@asc/shared/modules/translate';
import { RouterModule } from '@angular/router';
import { webAppRoutes } from './web-shell.route';
import { en_US, NZ_DATE_LOCALE, NZ_I18N, NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { enUS, vi } from 'date-fns/locale';
import en from '@angular/common/locales/en';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(en);

const PROVIDERS = [
    {
        provide: NZ_I18N,
        useValue: en_US,
    },
    {
        provide: NZ_DATE_LOCALE,
        useValue: enUS,
    },
];

@NgModule({
    imports: [
        CommonModule,
        WebShellUIModule,
        HttpClientModule,
        TranslateModule,
        NgxSpinnerModule,
        NzModalModule,
        RouterModule.forRoot(webAppRoutes, {
            initialNavigation: 'enabledBlocking',
            scrollPositionRestoration: 'top',
        }),
        ToastrModule.forRoot(),
    ],
    exports: [HttpClientModule, RouterModule],
    providers: [...PROVIDERS],
})
export class WebShellModule {
    constructor(@Optional() @SkipSelf() parentModule: WebShellModule, private i18n: NzI18nService) {
        this.i18n.setLocale(vi_VN);
        this.i18n.setDateLocale(vi);
        if (parentModule) {
            throw new Error('ShellModule is already loaded. Import it in the AppModule only');
        }
    }
}
