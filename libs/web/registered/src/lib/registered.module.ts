import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisteredComponent } from './registered.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AscButtonModule } from '@asc/shared/ui/button';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NoticationComponent } from './notication/notication.component';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { StudentInfoComponent } from './student-info/student-info.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UploadAvatarModule } from '@asc/web/shared/ui/upload-avatar';
import { SelectedCoursesComponent } from './selected-courses/selected-courses.component';
import { CurrencyFormatModule } from '@asc/web/shell/data-access/pipes/currency';
import { TranslocoModule } from '@ngneat/transloco';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { UploadCardPhotoModule } from '@asc/web/shared/ui/upload-card-photo';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'register-course',
                component: RegisteredComponent,
            },
        ]),
        ReactiveFormsModule,
        NzDatePickerModule,
        FormsModule,
        ValidatorRequiredDirectiveModule,
        NzRadioModule,
        UploadAvatarModule,
        AscButtonModule,
        FormControlModule,
        SelectControlModule,
        NzCheckboxModule,
        NzSelectModule,
        NzModalModule,
        SvgIconsModule,
        SafeHtmlPipeModule,
        CurrencyFormatModule,
        TranslocoModule,
        NzPopoverModule,
        UploadCardPhotoModule,
    ],
    declarations: [RegisteredComponent, NoticationComponent, StudentInfoComponent, SelectedCoursesComponent],
    exports: [RegisteredComponent],
})
export class RegisteredModule {}
