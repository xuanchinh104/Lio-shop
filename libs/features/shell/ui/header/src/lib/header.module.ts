import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MenuHorizontalComponent } from './menu-horizontal/menu-horizontal.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DropdownProfileComponent } from './dropdown-profile/dropdown-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { SidebarModule } from '@asc/features/shell/ui/sidebar';
import { IconModule } from '@asc/shared/ui/icon';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';

const LIBs = [
    NzModalModule,
    NzUploadModule,
    NzIconModule,
    NzDropDownModule,
    TranslocoModule,
    AscButtonModule,
    SidebarModule,
    IconModule,
    ConvertUrlPipeModule,
];

@NgModule({
    imports: [CommonModule, FormControlModule, ReactiveFormsModule, RouterModule, ...LIBs],
    declarations: [
        HeaderComponent,
        MenuHorizontalComponent,
        ChangePasswordComponent,
        AvatarComponent,
        DropdownProfileComponent,
        ProfileComponent,
    ],
    exports: [HeaderComponent, ProfileComponent, DropdownProfileComponent, AvatarComponent],
})
export class HeaderModule {}
