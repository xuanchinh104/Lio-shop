import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDetailComponent } from './course-detail.component';
import { RouterModule } from '@angular/router';
import { CourseNewItemModule } from '@asc/web/shared/ui/course-new-item';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { CourseItemModule } from '@asc/web/shared/ui/course-item';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';

const LIBs = [CommonModule];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: CourseDetailComponent,
            },
        ]),
        CourseNewItemModule,
        SvgIconsModule,
        TranslocoModule,
        SafeHtmlPipeModule,
        CourseItemModule,
        NzPaginationModule,
        CourseSkeletonModule,
    ],
    declarations: [CourseDetailComponent],
})
export class CourseDetailModule {}
