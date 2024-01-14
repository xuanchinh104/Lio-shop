import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseSearchComponent } from './course-search.component';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { CourseItemModule } from '@asc/web/shared/ui/course-item';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    declarations: [CourseSearchComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: CourseSearchComponent,
            },
        ]),
        SvgIconsModule,
        CourseItemModule,
        CourseSkeletonModule,
        NzPaginationModule,
        TranslocoModule,
    ],
})
export class CourseSearchModule {}
