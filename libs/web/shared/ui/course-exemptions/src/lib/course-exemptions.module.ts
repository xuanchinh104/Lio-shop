import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMenuModule } from '@progress/kendo-angular-grid';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { CourseExemptionsComponent } from './course-exemptions.component';
import { CourseExemptionsLoginComponent } from './course-exemptions-login/course-exemptions-login.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseExemptionsComponent,
            },
        ]),
        CommonModule,
        FilterMenuModule,
        RouterModule,
        SvgIconsModule,
        TranslocoModule,
        ValidatorRequiredDirectiveModule,
    ],
    declarations: [CourseExemptionsComponent, CourseExemptionsLoginComponent],
    exports: [CourseExemptionsComponent],
})
export class CourseExemptionsModule {}
