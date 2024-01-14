import { Inject, Injectable } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { HttpClient } from '@angular/common/http';
import { SafeAny } from '@asc/shared/utils';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthSsoService {
    private readonly apiUrl: string;

    constructor(private http: HttpClient, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        this.apiUrl = `${this.env.authServer}/api/${this.env.version}/`;
    }

    onSyncUser(request: SafeAny): Observable<unknown> {
        return this.http.post(this.apiUrl + 'Users/CreateOrUpdate', request);
    }
}
