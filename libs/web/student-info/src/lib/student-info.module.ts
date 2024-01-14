import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentInfoComponent } from './student-info.component';
import { RouterModule } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { AscButtonModule } from '@asc/shared/ui/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { StudentUpdateComponent } from './student-update/student-update.component';
import { CourseRegisteredComponent } from './course-registered/course-registered.component';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { IconModule } from '@asc/shared/ui/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UploadAvatarModule } from '@asc/web/shared/ui/upload-avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CourseAttachmentComponent } from './course-attachment/course-attachment.component';
import { CourseAttachmentDetailComponent } from './course-attachment-detail/course-attachment-detail.component';
import { CurrencyFormatModule } from '@asc/web/shell/data-access/pipes/currency';
import { StudentInfoRoute } from './student-info.route';
import { CourseUploadComponent } from './course-attachment-detail/course-upload/course-upload.component';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { AvatarModule } from '@asc/features/shell/ui/avatar';
import { TranslocoModule } from '@ngneat/transloco';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { UploadCardPhotoModule } from '@asc/web/shared/ui/upload-card-photo';
import { CapitalizeNameModule } from '@asc/web/shared/ui/capitalize-name';
import { HinhThucNhanBangComponent } from './course-attachment-detail/hinh-thuc-nhan-bang/hinh-thuc-nhan-bang.component';

@NgModule({
    imports: [
        CommonModule,
        StudentInfoRoute,
        NzTabsModule,
        FormControlModule,
        AscButtonModule,
        NzCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        ValidatorRequiredDirectiveModule,
        UploadCardPhotoModule,
        IconModule,
        NzRadioModule,
        NzSelectModule,
        UploadAvatarModule,
        NzToolTipModule,
        NzTableModule,
        CurrencyFormatModule,
        ConvertUrlModule,
        AvatarModule,
        TranslocoModule,
        NzPopoverModule,
        CapitalizeNameModule,
    ],
    declarations: [
        StudentInfoComponent,
        ChangePasswordComponent,
        StudentUpdateComponent,
        CourseRegisteredComponent,
        ReceiptListComponent,
        ReceiptDetailComponent,
        CourseAttachmentComponent,
        CourseAttachmentDetailComponent,
        CourseUploadComponent,
        HinhThucNhanBangComponent,
    ],
    exports: [ReceiptDetailComponent],
})
export class StudentInfoModule {}
