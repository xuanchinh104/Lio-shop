import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@asc/core/auth/services';
import { UrlConstant } from '@asc/core/constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(public router: Router, private auth: AuthService) {}

    /**
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.auth.isAuthorized()) {
            void this.router.navigate([UrlConstant.ROUTE.LOGIN]);
            return false;
        }
        return true;
    }

    /**
     *
     * @param childRoute
     * @param state
     */

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.auth.isAuthorized()) {
            void this.router.navigate([UrlConstant.ROUTE.LOGIN]);
            return false;
        }

        return true;
    }
}
