import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseItemComponent } from './course-item.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { RouterModule } from '@angular/router';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { CurrencyFormatModule } from '@asc/web/shell/data-access/pipes/currency';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadAvatarModule } from '@asc/web/shared/ui/upload-avatar';
import { UploadCardPhotoModule } from '@asc/web/shared/ui/upload-card-photo';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { CourseExemptionsComponent } from '@asc/web/shared/ui/course-exemptions';
import { CourseItemKttaComponent } from './course-item-ktta/course-item-ktta.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'uu-dai-hoc-phi',
                component: CourseExemptionsComponent,
            },
        ]),
        CommonModule,
        SvgIconsModule,
        RouterModule,
        ConvertUrlModule,
        CurrencyFormatModule,
        NzToolTipModule,
        TranslocoModule,
        AscButtonModule,
        FormControlModule,
        NzCheckboxModule,
        NzRadioModule,
        NzSelectModule,
        ReactiveFormsModule,
        UploadAvatarModule,
        UploadCardPhotoModule,
        ValidatorRequiredDirectiveModule,
    ],
    declarations: [CourseItemComponent, CourseItemKttaComponent],
    exports: [CourseItemComponent, CourseItemKttaComponent],
})
export class CourseItemModule {}
