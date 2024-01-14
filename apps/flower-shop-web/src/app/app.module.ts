import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconModule } from '@asc/shared/ui/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { WebShellModule } from '@asc/web/shell/feature';
import { getAppEnvironmentProvider } from '@asc/shared/app-config';
import { StorageKeyManager } from '@asc/shared/services/storage';
import { environment } from '../environments/environment';
import { SnowComponent } from './snow/snow.component';
import { ClientInterceptorProviders } from '@asc/core/auth/utils/interceptors';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@asc/shared/modules/translate';

@NgModule({
    declarations: [AppComponent, SnowComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IconModule,
        WebShellModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000',
        }),
        TranslateModule,
    ],
    providers: [
        getAppEnvironmentProvider(environment),
        ClientInterceptorProviders,
        // {
        //     provide: ErrorHandler,
        //     useValue: Sentry.createErrorHandler({
        //         showDialog: false,
        //     }),
        // },
        // {
        //     provide: Sentry.TraceService,
        //     deps: [Router],
        // },
        // {
        //     provide: APP_INITIALIZER,
        //     // eslint-disable-next-line @typescript-eslint/no-empty-function
        //     useFactory: () => () => {},
        //     deps: [Sentry.TraceService],
        //     multi: true,
        // },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        StorageKeyManager.setPrefix(environment.storageKey);
    }
}
