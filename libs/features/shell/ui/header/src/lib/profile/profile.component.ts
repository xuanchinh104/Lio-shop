import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@asc/core/auth/services';
import { Observable } from 'rxjs';
import { TokenInfo } from '@asc/core/auth/data-access';
import { map } from 'rxjs/operators';

@Component({
    selector: 'asc-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
    readonly userInfo$: Observable<TokenInfo | null> = this.authService.getUserInfo().pipe(
        map(userInfo => {
            if (!userInfo?.firstname && !userInfo?.lastname) {
                const fetchUserInfo = this.authService.userinfoSSO;
                if (fetchUserInfo) {
                    return {
                        ...userInfo,
                        firstname: fetchUserInfo.first_name,
                        lastname: fetchUserInfo.last_name,
                    } as TokenInfo;
                }
            }

            return userInfo;
        })
    );

    constructor(private authService: AuthService) {}
}
