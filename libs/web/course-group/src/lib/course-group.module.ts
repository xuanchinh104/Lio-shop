import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseGroupComponent } from './course-group.component';
import { RouterModule } from '@angular/router';
import { WebShellUIModule } from '@asc/web/shell/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { CourseItemGroupModule } from '@asc/web/shared/ui/course-item-group';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

const LIBs = [CommonModule, WebShellUIModule, ReactiveFormsModule, CourseSkeletonModule, TranslocoModule, FormsModule];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: CourseGroupComponent,
            },
        ]),
        SvgIconsModule,
        CourseItemGroupModule,
        NzPaginationModule,
    ],
    declarations: [CourseGroupComponent],
})
export class CourseGroupModule {}
