import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@asc/core/auth/services';
import { map, switchMap, tap } from 'rxjs/operators';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-sso-callback',
    template: ` <ng-container *ngIf="signIn$ | async"></ng-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SsoCallbackComponent {
    signIn$ = this.route.queryParams.pipe(
        map(params => params['code']),
        switchMap(code => this.auth.signInSSO(code, this.env.client_id, this.env.client_secret)),
        tap(() => {
            void this.router.navigate(['/']);
        })
    );

    constructor(
        private route: ActivatedRoute,
        private auth: AuthService,
        private router: Router,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}
}
