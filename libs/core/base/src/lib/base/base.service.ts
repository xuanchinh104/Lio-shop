import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Injectable({
    providedIn: 'root',
})
export class BaseService {
    protected apiUrl: string;
    protected http: HttpClient;

    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        this.http = injector.get(HttpClient);
        this.apiUrl = env.apiServer;
    }
}
