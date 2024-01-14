import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePostComponent } from './course-post.component';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { CoursePostItemModule } from '@asc/web/shared/ui/course-post-item';

const LIBs = [CommonModule, CourseSkeletonModule, NzPaginationModule, RouterModule, SvgIconsModule, TranslocoModule, CoursePostItemModule];

const UIs = [CoursePostComponent];
@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: CoursePostComponent,
            },
        ]),
    ],
    declarations: [...UIs],
})
export class CoursePostModule {}
