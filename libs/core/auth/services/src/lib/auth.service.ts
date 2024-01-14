import { Inject, Injectable, Injector } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { JwtToken, TokenInfo, UserInfo } from '@asc/core/auth/data-access';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { SafeAny, SecurityUtil } from '@asc/shared/utils';
import { BaseService } from '@asc/core/base';
import {
    API_ACCOUNT_LOGIN,
    API_AUTHENTICATE,
    API_AUTHENTICATE_SSO,
    API_CHANGE_PASSWORD,
    API_CHANGE_PASSWORD_IDS,
    API_CHANGE_PASSWORD_USERNAME,
    API_CREATE_USER,
    API_CREATE_USER_HRM,
    API_HASH_CODE,
    API_LOCKED_USER,
    API_REVOKE_TOKEN,
    API_SYNC_USER,
    API_UPDATE_USER,
    API_USER_INFO,
    API_USER_LOGIN,
    AuthConfig,
    GRANT_TYPE,
    REDIRECT_URL_CALLBACK,
    REDIRECT_URL_CALLBACK_HRM,
    REDIRECT_URL_LOGOUT,
    REDIRECT_URL_SSO,
    REDIRECT_URL_VERIFY_SSO,
} from './auth.config';
import { AccessToken, ResponseData } from '@asc/shared/data-access';
import { StorageService } from '@asc/shared/services/storage';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { JwtService } from './jwt';
import { MenuConfig } from '@asc/features/shell/data-access/state';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
    readonly refreshAvatar$ = new BehaviorSubject<boolean | null>(null);
    readonly clearUserInfo$ = new BehaviorSubject<boolean | null>(null);

    private options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    };
    private verifierCode!: string;
    private authenticationState = new ReplaySubject<UserInfo | null>(1);
    private userSsoCache$!: Observable<TokenInfo | null>;
    private userSsoHrmCache$!: Observable<TokenInfo | null>;

    constructor(
        injector: Injector,
        private router: Router,
        private storage: StorageService,
        private jwtService: JwtService,
        @Inject(APP_ENVIRONMENT) env: AppEnvironment
    ) {
        super(injector, env);
    }

    getHashCode(data: string, key: string): Observable<SafeAny> {
        return this.http
            .post<ResponseData<unknown>>(API_AUTHENTICATE_SSO(this.env.authServer), {
                data,
                key,
            })
            .pipe(map(res => res.result));
    }

    userLogin(request: SafeAny): Observable<any> {
        return this.http.post<ResponseData<unknown>>(API_USER_LOGIN(this.env.authServer), request).pipe(
            map(res => res.result)
            // switchMap(res => this.http.post<ResponseData<unknown>>(API_ACCOUNT_LOGIN(this.env.authServer), res).pipe())
        );
    }

    setUserToken(codeId: string, clientId: string, hashCode: string): Observable<SafeAny> {
        const data = {
            codeId,
            clientId,
            hashCode,
        };

        return this.http.post<AccessToken<unknown>>(API_HASH_CODE(this.env.authServer), data).pipe(
            switchMap(token => {
                const decodeToken = this.decodeToken(<string>token.accessToken);
                const parts = decodeToken?.HoTen.split(' ');
                let lastName = '';
                let firstName = '';
                if (parts && parts.length > 1) {
                    firstName = parts[0];
                    lastName = parts.slice(1).join(' ');
                }
                const request = {
                    firstName,
                    lastName,
                    email: decodeToken?.Email,
                    phoneNumber: decodeToken?.Sdt,
                    mobileNumber: decodeToken?.Sdt,
                    address: decodeToken?.DiaChi,
                    userName: decodeToken?.UserName,
                };

                const rqUserLogin = {
                    userName: decodeToken?.UserName,
                    password: '1111',
                    rememberMe: true,
                    returnUrl: '/connect/authorize?' + this.queryParams(),
                };

                return this.createUserHRM(request).pipe(
                    switchMap(() => this.userLogin(rqUserLogin).pipe(switchMap(() => this.getRedirectUrl())))
                );
            })
        );
    }

    getRedirectUrl(): Observable<unknown> {
        return this.http.get(REDIRECT_URL_SSO(this.env.authServer, this.queryParams()));
    }

    decodeToken(token: string): TokenInfo | null {
        try {
            const accessToken = token;
            if (accessToken) {
                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        })
                        .join('')
                );

                return JSON.parse(jsonPayload) as TokenInfo;
            }
        } catch (ex) {
            return null;
        }

        return null;
    }

    getUserInfo(): Observable<TokenInfo | null> {
        if (this.jwtService.getAccessToken()) {
            if (!this.userSsoCache$) {
                this.userSsoCache$ = of(this.jwtService.decodeToken());
            }

            return this.userSsoCache$;
        }

        return of(null);
    }

    signInSSOHRM(code: string, clientId: string, clientSecret: string): Observable<boolean> {
        const code_verifier = sessionStorage.getItem(AuthConfig.VERIFY_CODE);
        const params: { [key: string]: unknown } = {
            grant_type: GRANT_TYPE.AuthorizationCode,
            code,
            client_id: clientId,
            client_secret: clientSecret,
            code_verifier,
            redirect_uri: REDIRECT_URL_CALLBACK_HRM(window.location.origin),
        };

        return this.setAuthRequest(params);
    }

    signInSSO(code: string, clientId: string, clientSecret: string): Observable<boolean> {
        const code_verifier = sessionStorage.getItem(AuthConfig.VERIFY_CODE);
        const params: { [key: string]: unknown } = {
            grant_type: GRANT_TYPE.AuthorizationCode,
            code,
            client_id: clientId,
            client_secret: clientSecret,
            code_verifier,
            redirect_uri: REDIRECT_URL_CALLBACK(window.location.origin),
        };

        return this.setAuthRequest(params);
    }

    refreshToken(clientId: string, clientSecret: string): Observable<JwtToken> {
        const params: { [key: string]: unknown } = {
            refresh_token: this.jwtService.getRefreshToken(),
            grant_type: GRANT_TYPE.RefreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        };

        const paramStr = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return this.http.post<JwtToken>(API_AUTHENTICATE(this.env.authServer), paramStr, this.options).pipe(
            tap(token => {
                this.jwtService.setUserToken(token);
            })
        );
    }

    changePassword(request: SafeAny, userId: string): Observable<unknown> {
        return this.http
            .put<ResponseData<unknown>>(API_CHANGE_PASSWORD(this.env.authServer), {
                ...request,
                id: userId,
            })
            .pipe(map(res => res.result));
    }

    changePasswordByUsername(request: SafeAny, username: string): Observable<unknown> {
        return this.http
            .put<ResponseData<unknown>>(API_CHANGE_PASSWORD_USERNAME(this.env.authServer), {
                ...request,
                userName: username,
            })
            .pipe(map(res => res.result));
    }

    changePasswordByIds(request: SafeAny): Observable<unknown> {
        return this.http
            .put<ResponseData<unknown>>(API_CHANGE_PASSWORD_IDS(this.env.authServer), {
                ...request,
            })
            .pipe(map(res => res.result));
    }

    onSyncUser(request: SafeAny): Observable<unknown> {
        return this.http.post<ResponseData<unknown>>(API_SYNC_USER(this.env.authServer), request).pipe(map(res => res.result));
    }

    createUserHRM(request: SafeAny): Observable<any> {
        return this.http.post<ResponseData<unknown>>(API_CREATE_USER_HRM(this.env.authServer), request);
    }

    createUser(request: SafeAny): Observable<unknown> {
        return this.http.post<ResponseData<unknown>>(API_CREATE_USER(this.env.authServer), request);
    }

    updateUser(request: SafeAny): Observable<unknown> {
        return this.http.put<ResponseData<unknown>>(API_UPDATE_USER(this.env.authServer), request);
    }

    onLockedUser(request: SafeAny): Observable<unknown> {
        return this.http.put<ResponseData<unknown>>(API_LOCKED_USER(this.env.authServer), request).pipe(map(res => res.result));
    }

    doBackLogin(): void {
        this.storage.clear(AuthConfig.JWT_TOKEN);
        this.storage.clear(AuthConfig.USER_INFO);
        void this.router.navigate([this.env.redirectWhenLogout]);
    }

    getVerifierCode(): string {
        if (!this.verifierCode) {
            this.verifierCode = SecurityUtil.generateGuid();
            sessionStorage.setItem(AuthConfig.VERIFY_CODE, this.verifierCode);
        }
        return this.verifierCode;
    }

    getAuthenticationState(): Observable<UserInfo | null> {
        return this.authenticationState.asObservable();
    }

    onLogoutByRedirect(): void {
        const params: { [key: string]: unknown } = {
            post_logout_redirect_uri: REDIRECT_URL_VERIFY_SSO,
            id_token_hint: this.jwtService.getIdToken(),
        };
        const paramStr = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');

        window.location.assign(REDIRECT_URL_LOGOUT(this.env.authServer, paramStr));
    }

    redirectWhenWrong(): void {
        this.storage.clear(AuthConfig.JWT_TOKEN);
        this.storage.clear(AuthConfig.USER_INFO);
        window.location.assign(this.env.authServer);
    }

    revokeToken(clientId: string, clientSecret: string): Observable<any> {
        const params: { [key: string]: unknown } = {
            token: this.jwtService.getRefreshToken(),
            client_id: clientId,
            client_secret: clientSecret,
            token_type_hint: GRANT_TYPE.RefreshToken,
        };
        const paramStr = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return this.http.post<any>(API_REVOKE_TOKEN(this.env.authServer), paramStr, this.options);
    }

    isAuthorized(): boolean {
        return !!this.jwtService.getAccessToken();
    }

    queryParams(): string {
        const verifier = this.getVerifierCode();
        const params: { [key: string]: string } = {
            response_type: 'code',
            client_id: this.env.client_id,
            redirect_uri: REDIRECT_URL_CALLBACK(window.location.origin),
            code_challenge_method: 'S256',
            scope: 'internal openid offline_access email user_name last_name first_name id_user avatar',
            code_challenge: SecurityUtil.generateSHA256(verifier),
            code_verifier: verifier,
            state: '123',
        };
        return Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
    }

    get userinfoSSO(): UserInfo | null {
        return this.storage.retrieve<UserInfo>(AuthConfig.USER_INFO) ?? null;
    }

    private setAuthRequest(params: SafeAny): Observable<boolean> {
        const paramStr = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return this.http.post<JwtToken>(API_AUTHENTICATE(this.env.authServer), paramStr, this.options).pipe(
            map((token: JwtToken) => {
                if (token) {
                    this.jwtService.setUserToken(token);
                    return true;
                }
                return false;
            }),
            switchMap(isLogin =>
                this.http.get<UserInfo>(API_USER_INFO(this.env.authServer)).pipe(
                    tap(rs => {
                        // cache info
                        if (rs) {
                            this.storage.store<UserInfo>(AuthConfig.USER_INFO, rs);
                        }
                    }),
                    map(() => isLogin)
                )
            )
        );
    }

    private get userId(): string {
        return this.storage.retrieve<UserInfo>(AuthConfig.USER_INFO)?.id_user.toString() ?? '';
    }
}
