import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AuthService } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { tap } from 'rxjs/operators';
import { MenuService } from '@asc/features/shell/data-access/state';

@Component({
    selector: 'asc-verify-sso',
    template: ` <ng-container *ngIf="revokeToken$ | async"></ng-container> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySsoComponent {
    readonly revokeToken$ = this.auth.revokeToken(this.env.client_id, this.env.client_secret).pipe(
        tap(() => {
            this.auth.doBackLogin();
        })
    );

    constructor(private auth: AuthService, private menuService: MenuService, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {}
}
