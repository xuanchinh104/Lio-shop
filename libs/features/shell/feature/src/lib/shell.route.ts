import { Route } from '@angular/router';
import { MainViewComponent } from '@asc/features/shell/ui/main-view';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: async () => (await import('@asc/features/login')).LoginModule,
    },
    {
        path: 'dashboard',
        loadChildren: async () => (await import('@asc/features/dashboard')).DashboardModule,
        canActivate: [],
    },
    {
        path: 'system',
        loadChildren: async () => (await import('@asc/features/system/feature')).SystemModule,
    },
    {
        path: '',
        component: MainViewComponent,
        children: [
            {
                path: '',
                loadChildren: async () => (await import('@asc/features/overview/feature')).OverviewModule,
            },
            {
                path: 'website-manager',
                loadChildren: async () => (await import('@asc/features/website-manager/feature')).WebsiteManagerModule,
            },
        ],
    },
    {
        path: '**',
        loadChildren: async () => (await import('@asc/features/common/not-found/feature')).NotFoundModule,
    },
];
