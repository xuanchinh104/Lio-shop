import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list.component';
import { RouterModule } from '@angular/router';
import { WebShellUIModule } from '@asc/web/shell/ui';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { CourseItemModule } from '@asc/web/shared/ui/course-item';
import { TranslocoModule } from '@ngneat/transloco';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AscButtonModule } from '@asc/shared/ui/button';
import { CourseSubscribeInfoComponent } from './course-subscribe-info/course-subscribe-info.component';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';
import { CourseItemGroupModule } from '@asc/web/shared/ui/course-item-group';

const LIBs = [
    CommonModule,
    WebShellUIModule,
    SvgIconsModule,
    ReactiveFormsModule,
    CourseSkeletonModule,
    CourseItemModule,
    ValidatorRequiredDirectiveModule,
    FormControlModule,
    AscButtonModule,
    TranslocoModule,
    FormsModule,

    NzPaginationModule,
    NzToolTipModule,
    NzSelectModule,
];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: CourseListComponent,
            },
        ]),
        ConvertUrlPipeModule,
        CourseItemGroupModule,
    ],
    declarations: [CourseListComponent, CourseSubscribeInfoComponent],
    exports: [CourseSubscribeInfoComponent],
})
export class CourseListModule {}
