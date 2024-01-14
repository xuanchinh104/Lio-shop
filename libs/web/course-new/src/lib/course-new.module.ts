import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNewComponent } from './course-new.component';
import { CourseNewDetailComponent } from './course-new-detail/course-new-detail.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RowFilterModule } from '@progress/kendo-angular-grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { SvgIconsModule } from '@ngneat/svg-icon';
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
                component: CourseNewComponent,
            },
            {
                path: ':alias',
                component: CourseNewDetailComponent,
            },
        ]),
        CourseNewItemModule,
        SafeHtmlPipeModule,
    ],
    declarations: [CourseNewComponent, CourseNewDetailComponent],
})
export class CourseNewModule {}
