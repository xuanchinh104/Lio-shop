import { Route } from '@angular/router';
import { LayoutComponent } from '@asc/web/shell/ui';

export const webAppRoutes: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: async () => (await import('@asc/web/home')).HomeModule,
            },
            {
                path: '',
                loadChildren: async () => (await import('@asc/web/registered')).RegisteredModule,
            },
            {
                path: 'register',
                loadChildren: async () => (await import('@asc/web/student-register')).StudentRegisterModule,
            },
            {
                path: 'profile',
                loadChildren: async () => (await import('@asc/web/student-info')).StudentInfoModule,
            },
            {
                path: 'course/:key/:aliasPhong/:alias',
                loadChildren: async () => (await import('@asc/web/course-list')).CourseListModule,
            },
            {
                path: 'course-group/:alias',
                loadChildren: async () => (await import('@asc/web/course-group')).CourseGroupModule,
            },
            {
                path: 'search',
                loadChildren: async () => (await import('@asc/web/course-search')).CourseSearchModule,
            },
            {
                path: 'payment',
                loadChildren: async () => (await import('@asc/web/payment')).WebPaymentModule,
            },
            {
                path: 'tra-cuu-van-bang',
                loadChildren: async () => (await import('@asc/web/search-certificate')).SearchCertificateModule,
            },
            {
                path: 'uu-dai-hoc-phi/:alias',
                loadChildren: async () => (await import('@asc/web/shared/ui/course-exemptions')).CourseExemptionsModule,
            },
            {
                path: 'tin-tuc',
                loadChildren: async () => (await import('@asc/web/course-new')).CourseNewModule,
            },
            {
                path: 'thong-bao',
                loadChildren: async () => (await import('@asc/web/course-notification')).CourseNotificationModule,
            },
            {
                path: 'bai-viet',
                loadChildren: async () => (await import('@asc/web/course-post')).CoursePostModule,
            },
            {
                path: 'course-group/:key/:alias',
                loadChildren: async () => (await import('@asc/web/course-detail')).CourseDetailModule,
            },
            // {
            //     path: '**',
            //     pathMatch: 'full',
            //     loadChildren: async () => (await import('@asc/web/notfound')).WebNotfoundModule,
            // },
        ],
    },
    {
        path: '',
        loadChildren: async () => (await import('@asc/web/activate')).ActivateModule,
    },
    {
        path: '',
        loadChildren: async () => (await import('@asc/web/login')).WebLoginModule,
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '**',
                pathMatch: 'full',
                loadChildren: async () => (await import('@asc/web/notfound')).WebNotfoundModule,
            },
        ],
    },
];
