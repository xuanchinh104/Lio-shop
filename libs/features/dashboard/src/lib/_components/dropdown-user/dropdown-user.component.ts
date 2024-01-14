import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@asc/core/auth/services';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenInfo } from '@asc/core/auth/data-access';

@Component({
    selector: 'ui-dropdown-user',
    templateUrl: './dropdown-user.component.html',
    styleUrls: ['./dropdown-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownUserComponent {
    readonly userInfo$: Observable<TokenInfo | null> = this.auth.getUserInfo().pipe(
        map(userInfo => {
            if (!userInfo?.firstname && !userInfo?.lastname) {
                const fetchUserInfo = this.auth.userinfoSSO;
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

    constructor(private auth: AuthService) {}
}
