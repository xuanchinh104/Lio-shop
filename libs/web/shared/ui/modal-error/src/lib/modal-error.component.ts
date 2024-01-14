import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { AuthService, REDIRECT_URL_CALLBACK, REDIRECT_URL_FORGOT_PASSWORD, REDIRECT_URL_SSO } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { SecurityUtil } from '@asc/shared/utils';

@Component({
    selector: 'asc-modal-error',
    templateUrl: './modal-error.component.html',
    styleUrls: ['./modal-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalErrorComponent implements OnDestroy {
    @Input() errorText!: string;
    private destroyed$ = new Subject();

    constructor(@Inject(APP_ENVIRONMENT) protected env: AppEnvironment, private auth: AuthService, private modalRef: NzModalRef) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    closeForm(result = false): void {
        this.modalRef.close(result);
    }

    signIn(): void {
        window.location.assign(REDIRECT_URL_SSO(this.env.authServer, this.queryParams));
    }

    forgotPassword(): void {
        window.location.assign(REDIRECT_URL_FORGOT_PASSWORD(this.env.authServer));
    }

    private get queryParams(): string {
        const verifier = this.auth.getVerifierCode();
        const params: { [key: string]: string } = {
            response_type: 'code',
            client_id: this.env.client_id,
            redirect_uri: REDIRECT_URL_CALLBACK(window.location.origin),
            code_challenge_method: 'S256',
            // scope: 'internal openid offline_access email user_name last_name first_name id_user avatar',
            scope: this.env.client_scope,
            code_challenge: SecurityUtil.generateSHA256(verifier),
            code_verifier: verifier,
            state: '123',
        };

        return Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
    }
}
