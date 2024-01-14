import { RouterModule, Routes } from '@angular/router';
import { WebsiteManagerComponent } from './website-manager.component';
import { TinTucComponent } from './tin-tuc/tin-tuc.component';
import { DanhMucTinTucComponent } from './danh-muc-tin-tuc/danh-muc-tin-tuc.component';
import { BaiVietComponent } from './bai-viet/bai-viet.component';

const routes: Routes = [
    {
        path: '',
        component: WebsiteManagerComponent,
        children: [
            {
                path: '',
                redirectTo: 'danh-muc-tin-tuc',
                pathMatch: 'full',
            },
            {
                path: 'danh-muc-tin-tuc',
                component: DanhMucTinTucComponent,
            },
            {
                path: 'tin-tuc',
                component: TinTucComponent,
            },
            {
                path: 'bai-viet',
                component: BaiVietComponent,
            },
        ],
    },
];

export const WebsiteManagerRouting = RouterModule.forChild(routes);
