import { UserInfo } from '@asc/core/auth/data-access';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface AuthState {
    userInfo: UserInfo | null;
}

@Injectable()
export class AuthStore extends ComponentStore<AuthState> {
    readonly userInfo$ = this.select(s => s.userInfo);

    constructor() {
        super({
            userInfo: null,
        });
    }

    setUserInfo(userInfo: UserInfo): void {
        this.patchState({ userInfo });
    }
}
