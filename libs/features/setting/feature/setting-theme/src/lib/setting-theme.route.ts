import { RouterModule, Routes } from '@angular/router';
import { SettingThemeComponent } from './setting-theme/setting-theme.component';

const routes: Routes = [
    {
        path: '',
        component: SettingThemeComponent,
        data: {
            title: 'Cấu hình website',
        },
    },
];

export const SettingThemeRoute = RouterModule.forChild(routes);
