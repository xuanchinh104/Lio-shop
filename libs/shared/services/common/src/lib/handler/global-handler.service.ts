import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment) {}

    handleError(error: any): void {
        if (!this.env.production) {
            console.error(error);
        }
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}
