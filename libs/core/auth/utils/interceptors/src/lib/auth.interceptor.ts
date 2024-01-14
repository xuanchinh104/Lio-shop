import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';
import { AuthService, JwtService } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { JwtToken } from '@asc/core/auth/data-access';
import { TranslocoService } from '@ngneat/transloco';
import { LANG_ENUM } from '@asc/shared/modules/translate';
import { StorageService } from '@asc/shared/services/storage';

const AcceptLangList: { [key: string]: string } = {
    [LANG_ENUM.VI]: 'vi-VN',
    [LANG_ENUM.EN]: 'en-US',
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private authHeader = 'Authorization';
    private refreshTokenInProgress = false;
    private refreshTokenSubject = new BehaviorSubject<JwtToken | null>(null);
    private currentLANG = this.translocoService.getActiveLang();
    private acceptLangList = AcceptLangList;

    constructor(
        private auth: AuthService,
        private jwtService: JwtService,
        private storage: StorageService,
        private translocoService: TranslocoService,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
        const configUrl = req.url.split('/');
        req = req.clone({
            setHeaders: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'X-Content-Type-Options': 'nosniff',
                'X-XSS-Protection': '1',
                'Accept-Language': this.acceptLangList[this.currentLANG],
            },
        });
        if (configUrl.includes('_config') || configUrl.includes('i18n') || configUrl.includes('Login')) {
            return next.handle(req);
        }
        return next.handle(this.setAuthToken(req)).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401) {
                    if (this.refreshTokenInProgress) {
                        return this.refreshTokenSubject.pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.setAuthToken(req)))
                        );
                    } else {
                        this.refreshTokenInProgress = true;
                        this.refreshTokenSubject.next(null);

                        return this.auth.refreshToken(this.env.client_id, this.env.client_secret).pipe(
                            switchMap((authToken: any) => {
                                this.refreshTokenSubject.next(authToken);
                                return next.handle(this.setAuthToken(req));
                            }),
                            finalize(() => {
                                this.refreshTokenInProgress = false;
                            })
                        );
                    }
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private setAuthToken(req: HttpRequest<SafeAny>): HttpRequest<SafeAny> {
        // Get access token
        const accessToken = this.jwtService.getAccessToken();
        if (!accessToken) {
            return req;
        }
        return req.clone({
            headers: req.headers.set(this.authHeader, 'Bearer ' + accessToken).set('Access-Control-Max-Age', '86400'),
        });
    }
}
