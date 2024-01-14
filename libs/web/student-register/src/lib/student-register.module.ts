import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRegisterComponent } from './student-register.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NotificationsComponent } from './notifications/notifications.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { UploadAvatarModule } from '@asc/web/shared/ui/upload-avatar';
import { TranslocoModule } from '@ngneat/transloco';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { UploadCardPhotoModule } from '@asc/web/shared/ui/upload-card-photo';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: StudentRegisterComponent,
            },
        ]),
        ReactiveFormsModule,
        NzDatePickerModule,
        FormsModule,
        ValidatorRequiredDirectiveModule,
        NzRadioModule,
        AscButtonModule,
        FormControlModule,
        SelectControlModule,
        NzCheckboxModule,
        NzSelectModule,
        SvgIconsModule,
        UploadAvatarModule,
        TranslocoModule,
        NzPopoverModule,
        UploadCardPhotoModule,
    ],
    declarations: [StudentRegisterComponent, NotificationsComponent],
})
export class StudentRegisterModule {}
