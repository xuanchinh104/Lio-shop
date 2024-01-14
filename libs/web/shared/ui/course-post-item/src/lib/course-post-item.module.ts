import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePostItemComponent } from './course-post-item.component';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { CoursePostDetailComponent } from './course-post-detail/course-post-detail.component';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

const LIBs = [CommonModule, ConvertUrlModule, CourseSkeletonModule, RouterModule, SafeHtmlPipeModule, SvgIconsModule, TranslocoModule];

const UIs = [CoursePostItemComponent, CoursePostDetailComponent];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: 'bai-viet/:alias',
                component: CoursePostDetailComponent,
            },
        ]),
    ],
    declarations: [...UIs],
    exports: [...UIs],
})
export class CoursePostItemModule {}
