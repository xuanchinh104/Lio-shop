import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsoCallbackComponent } from './sso-callback/sso-callback.component';
import { VerifySsoComponent } from './verify-sso/verify-sso.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'sso',
        component: SsoCallbackComponent,
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
    declarations: [SsoCallbackComponent, VerifySsoComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class WebLoginModule {}
