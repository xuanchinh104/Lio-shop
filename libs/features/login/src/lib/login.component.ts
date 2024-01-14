import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { UrlConstant } from '@asc/core/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import {
    API_ACCOUNT_LOGIN,
    API_ACCOUNT_LOGIN_MICROSOFT,
    AuthService,
    JwtService,
    REDIRECT_URL_AZURE,
    REDIRECT_URL_CALLBACK,
    REDIRECT_URL_SSO,
    REDIRECT_URL_SSO_HRM,
} from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { MenuService } from '@asc/features/shell/data-access/state';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StorageService } from '@asc/shared/services/storage';
import { SafeAny, SecurityUtil } from '@asc/shared/utils';

const FORM_PARAMS = {
    userName: 'userName',
    password: 'password',
    sessionCode: 'sessionCode',
};

@Component({
    selector: 'as-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TRANSLOCO_SCOPE,
            useValue: 'login',
        },
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    formLogin = this.formBuilder.group({
        [FORM_PARAMS.userName]: ['', Validators.required],
        [FORM_PARAMS.password]: ['', Validators.required],
        [FORM_PARAMS.sessionCode]: [''],
    });

    returnUrl?: string;
    logoUrl = this.env.logoUrl;

    isLoginHrm = false;
    clientId!: string;

    private destroyed$ = new Subject();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private jwtservice: JwtService,
        private menuService: MenuService,
        private storageService: StorageService,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}

    ngOnInit(): void {
        const isLoginHrm = this.storageService.retrieve('isLoginHrm') as boolean;
        if (!isLoginHrm) {
            this.isLoginHrm = isLoginHrm;
            this.returnUrl = this.route.snapshot.queryParams.returnUrl || UrlConstant.ROUTE.LOGIN;
            void this.router.navigate([this.returnUrl]);
            if (this.jwtservice.getAccessToken()) {
                void this.router.navigate([this.env.redirectUrl]);
            } else {
                this.menuService.clearState();
            }
        } else {
            this.isLoginHrm = isLoginHrm;
            this.getData();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    loginAzure(): void {
        // window.location.assign(REDIRECT_URL_AZURE(this.env.authServerAzure, this.env.t
        // enant, this.queryParamsAzure));
    }

    loginSSO(isLoginHrm: boolean): void {
        this.isLoginHrm = isLoginHrm;
        this.storageService.store('isLoginHrm', this.isLoginHrm);
    }

    /**
     * Signins auth component
     */
    signin(): void {
        window.location.assign(REDIRECT_URL_SSO(this.env.authServer, this.queryParams));
    }

    signInHrm(): void {
        const data = this.env.client_id_hrm + this.env.authServer + '1';
        const key = this.env.client_secret_hrm;

        this.auth
            .getHashCode(data, key)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(hashCode => {
                if (hashCode) {
                    window.location.assign(REDIRECT_URL_SSO_HRM(this.env.authServerSSO + '/login.html', this.queryParamsHrm(hashCode)));
                }
            });
    }

    signMicrosoft(): void {
        window.location.assign(API_ACCOUNT_LOGIN_MICROSOFT(this.env.authServer));
    }

    private getData(): void {
        const key = this.env.client_secret_hrm;
        this.route.queryParams
            .pipe(
                map(params => params['clientId']),
                tap(clientId => {
                    this.clientId = clientId;
                    if (clientId) {
                        this.signin();
                    }
                })
                // switchMap(
                //     clientId => {
                //         if (clientId === this.env.client_id_hrm) {
                //             return this.auth.getRedirectUrl();
                //         }
                //         return of();
                //     }
                //     // this.auth.getHashCode(codeId + this.env.client_id_hrm, key).pipe(
                //     //     switchMap(() => {
                //     //         if (codeId) {
                //     //             return this.auth.signInSSOHRM(codeId, this.env.client_id, this.env.client_secret).pipe(
                //     //                 tap(() => {
                //     //                     void this.router.navigate([this.env.redirectUrl]);
                //     //                 })
                //     //             );
                //     //         }
                //     //         return of();
                //     //     })
                //     // )
                // )
            )
            .subscribe();
    }

    private queryParamsHrm(hashCode: string): string {
        this.auth.getVerifierCode();
        const params: { [key: string]: string } = {
            clientId: this.env.client_id_hrm,
            redirectUrl: this.env.authServer,
            systemId: '1',
            hashCode,
            // code_verifier: verifier,
            // code_challenge: SecurityUtil.generateSHA256(verifier),
        };

        return Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
    }

    private get queryParams(): string {
        const verifier = this.auth.getVerifierCode();
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

    // private get queryParamsAzure(): string {
    //     const params: { [key: string]: string } = {
    //         client_id: this.env.client_id_azure,
    //         redirect_uri: this.env.authServer + '/Account/LoginMicrosoft',
    //         response_type: 'id_token',
    //         scope: 'openid profile',
    //         response_mode: 'form_post',
    //     };
    //     return Object.keys(params)
    //         .map(key => `${key}=${params[key]}`)
    //         .join('&');
    // }
}
