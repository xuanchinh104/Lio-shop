import { Inject, Injectable, Injector } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { ApiService } from '@asc/shared/services/common';

@Injectable({
    providedIn: 'root',
})
export class BaseWebService extends ApiService {
    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);

        this.setConfig('COURSE');
    }
}
