import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { StorageService } from '@asc/shared/services/storage';

@Component({
    selector: 'as-sso-callback-hrm',
    template: ` <ng-container *ngIf="signIn$ | async"></ng-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SsoCallbackHrmComponent {
    signIn$ = this.route.queryParams.pipe(
        map(params => params['code']),
        switchMap(code => this.auth.signInSSO(code, this.env.client_id, this.env.client_secret)),
        tap(() => {
            void this.router.navigate([this.env.redirectUrl]);
        })
    );

    constructor(
        private route: ActivatedRoute,
        private auth: AuthService,
        private router: Router,
        private storageService: StorageService,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}
}
