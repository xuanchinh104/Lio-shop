import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MessageService } from '@progress/kendo-angular-l10n';
import { TRANSLOCO_LOADING_TEMPLATE } from '@ngneat/transloco';
import { en_US, NZ_DATE_LOCALE, NZ_I18N, NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { enUS, vi } from 'date-fns/locale';
import { MessageKendoService } from '@asc/shared/services/common';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { appRoutes } from './shell.route';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@asc/shared/modules/translate';
import { HttpInterceptorProviders } from '@asc/core/auth/utils/interceptors';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EffectsModule } from '@ngrx/effects';
import { AppInit, ApplicationEffects } from '@asc/core/app-init';
import { Store, StoreModule } from '@ngrx/store';

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
    {
        provide: MessageService,
        useClass: MessageKendoService,
    },
    {
        provide: TRANSLOCO_LOADING_TEMPLATE,
        useValue: '<p>loading...</p>',
    },
];

@NgModule({
    imports: [
        CommonModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        NgxSpinnerModule,
        TranslateModule,
        NzModalModule,
        StoreModule.forRoot([]),
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking',
            scrollPositionRestoration: 'top',
        }),
        EffectsModule.forRoot([ApplicationEffects]),
    ],
    exports: [RouterModule, HttpClientModule],
    providers: [
        ...PROVIDERS,
        HttpInterceptorProviders,
        {
            provide: APP_INITIALIZER,
            useFactory: (store: Store) => () => {
                store.dispatch(AppInit());
            },
            multi: true,
            deps: [Store],
        },
    ],
})
export class ShellModule {
    constructor(@Optional() @SkipSelf() parentModule: ShellModule, private i18n: NzI18nService) {
        this.i18n.setLocale(vi_VN);
        this.i18n.setDateLocale(vi);
        if (parentModule) {
            throw new Error('ShellModule is already loaded. Import it in the AppModule only');
        }
    }
}
