import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from './base/base.service';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Injectable({
    providedIn: 'root',
})
export class ApiService extends BaseService {
    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);
    }

    setConfig(prefix: string): void {
        this.prefix = prefix;
    }
}
