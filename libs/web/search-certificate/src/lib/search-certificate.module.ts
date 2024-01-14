import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCertificateComponent } from './search-certificate.component';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { RowFilterModule } from '@progress/kendo-angular-grid';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';

const LIBs = [CommonModule];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: SearchCertificateComponent,
            },
        ]),
        TranslocoModule,
        SvgIconsModule,
        FormControlModule,
        ReactiveFormsModule,
        RowFilterModule,
        ValidatorRequiredDirectiveModule,
        NzPaginationModule,
        CourseSkeletonModule,
    ],
    declarations: [SearchCertificateComponent],
})
export class SearchCertificateModule {}
