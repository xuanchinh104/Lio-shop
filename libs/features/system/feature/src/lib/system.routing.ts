import { RouterModule, Routes } from '@angular/router';
import { SystemComponent } from './system.component';
import { UserListComponent } from './user-list/user-list.component';
import { SetRolesUserComponent } from './set-roles-user/set-roles-user.component';
import { RoleListComponent } from './role-list/role-list.component';
import { UserSyncComponent } from './user-sync/user-sync.component';
import { ConfigSendMailComponent } from './config-send-mail/config-send-mail.component';
import { ConfigContentMailComponent } from './config-content-mail/config-content-mail.component';
import { SystemDictionaryComponent } from './system-dictionary/system-dictionary.component';
import { ConfigReportComponent } from './config-report/config-report.component';
import { SetRolesDepartmentComponent } from './set-roles-department/set-roles-department.component';

const routes: Routes = [
    {
        path: '',
        component: SystemComponent,
        children: [
            {
                path: '',
                redirectTo: 'user',
                pathMatch: 'full',
            },
            {
                path: 'user',
                component: UserListComponent,
            },
            {
                path: 'vai-tro-quyen-han',
                component: RoleListComponent,
            },
            {
                path: 'phan-quyen-nguoi-dung',
                component: SetRolesUserComponent,
            },
            {
                path: 'dong-bo-nhan-su',
                component: UserSyncComponent,
            },
            {
                path: 'phan-he',
                loadChildren: async () => (await import('@asc/features/configuration/feature')).ConfigurationModule,
            },
            {
                path: 'cau-hinh',
                loadChildren: async () => (await import('@asc/features/setting/feature/setting-theme')).SettingThemeModule,
            },
            {
                path: 'cau-hinh-email',
                component: ConfigSendMailComponent,
            },
            {
                path: 'cau-hinh-noi-dung-email',
                component: ConfigContentMailComponent,
            },
            {
                path: 'tu-dien-he-thong',
                component: SystemDictionaryComponent,
            },
            {
                path: 'cau-hinh-bieu-mau',
                component: ConfigReportComponent,
            },
            {
                path: 'phan-quyen-phong-ban',
                component: SetRolesDepartmentComponent,
            },
        ],
    },
];

export const SystemRouting = RouterModule.forChild(routes);
