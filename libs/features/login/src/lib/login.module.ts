import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslateModule } from '@asc/shared/modules/translate';
import { SsoCallbackComponent } from './sso-callback/sso-callback.component';
import { VerifySsoComponent } from './verify-sso/verify-sso.component';
import { SsoCallbackHrmComponent } from './sso-callback-hrm/sso-callback-hrm.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Đăng nhập',
        },
    },
    {
        path: 'sso',
        component: SsoCallbackHrmComponent,
        data: {
            title: 'Đăng nhập SSO',
        },
    },
    {
        path: 'verify-sso',
        component: VerifySsoComponent,
        data: {
            title: 'Đăng xuất',
        },
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), TranslateModule],
    declarations: [LoginComponent, SsoCallbackComponent, VerifySsoComponent, SsoCallbackHrmComponent],
    providers: [
        {
            provide: TRANSLOCO_SCOPE,
            useValue: 'login',
        },
    ],
})
export class LoginModule {}
