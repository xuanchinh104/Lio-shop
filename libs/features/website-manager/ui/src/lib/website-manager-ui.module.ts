import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTinTucComponent } from './form-tin-tuc/form-tin-tuc.component';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FilterMenuModule } from '@progress/kendo-angular-treelist';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormDanhMucTinTucComponent } from './form-danh-muc-tin-tuc/form-danh-muc-tin-tuc.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UploadAvatarModule } from '@asc/shared/ui/upload-avatar';
import { FormBaiVietComponent } from './form-bai-viet/form-bai-viet.component';

@NgModule({
    imports: [
        CommonModule,
        AscButtonModule,
        FilterMenuModule,
        FormControlModule,
        ReactiveFormsModule,
        TranslocoModule,
        ValidatorRequiredDirectiveModule,
        WrapFormModule,
        NzCheckboxModule,
        NzSelectModule,
        CKEditorModule,
        UploadAvatarModule,
    ],
    declarations: [FormTinTucComponent, FormDanhMucTinTucComponent, FormBaiVietComponent],
})
export class WebsiteManagerUiModule {}
