import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

// Sentry.init({
//     dsn: 'https://924f3beaf3294f22a6a5620cb1d6c11f@o4504196660461568.ingest.sentry.io/4504455668629504',
//     integrations: [
//         new BrowserTracing({
//             tracingOrigins: ['localhost', 'localhost:8080', 'http://localhost:8080', 'https://devcourse.ascvn.vn'],
//             tracePropagationTargets: ['localhost', 'localhost:8080', 'http://localhost:8080', 'https://devcourse.ascvn.vn'],
//             routingInstrumentation: Sentry.routingInstrumentation,
//         }),
//     ],
//
//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
// });

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
