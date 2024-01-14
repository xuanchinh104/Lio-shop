import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview.component';

const routes: Routes = [
    {
        path: 'overview',
        component: OverviewComponent,
        data: {
            title: '',
        },
    }
];

export const OverviewRouting = RouterModule.forChild(routes);
