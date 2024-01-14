import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNotificationComponent } from './course-notification.component';
import { CourseNotificationDetailComponent } from './course-notification-detail/course-notification-detail.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { RowFilterModule } from '@progress/kendo-angular-grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { RouterModule } from '@angular/router';
import { CourseNewItemModule } from '@asc/web/shared/ui/course-new-item';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';

const LIBs = [
    CommonModule,
    TranslocoModule,
    SvgIconsModule,
    FormControlModule,
    ReactiveFormsModule,
    RowFilterModule,
    NzPaginationModule,
    CourseSkeletonModule,
];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: CourseNotificationComponent,
            },
            {
                path: ':alias',
                component: CourseNotificationDetailComponent,
            },
        ]),
        CourseNewItemModule,
        SafeHtmlPipeModule,
    ],
    declarations: [CourseNotificationComponent, CourseNotificationDetailComponent],
})
export class CourseNotificationModule {}
