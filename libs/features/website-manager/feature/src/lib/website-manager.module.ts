import { TranslateModule } from '@asc/shared/modules/translate';
import { GridModule } from '@progress/kendo-angular-grid';
import { SkeletonModule } from '@asc/shared/ui/skeleton';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { EmptyModule } from '@asc/features/shell/ui/empty';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AscButtonModule } from '@asc/shared/ui/button';
import { IconModule } from '@asc/shared/ui/icon';
import { GridControlModule } from '@asc/shared/ui/grid-control';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingViewModule } from '@asc/features/shell/ui/setting-view';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { HideIfUnauthorizedModule } from '@asc/core/auth/utils/directives';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { NgModule } from '@angular/core';
import { WebsiteManagerComponent } from './website-manager.component';
import { TinTucComponent } from './tin-tuc/tin-tuc.component';
import { DanhMucTinTucComponent } from './danh-muc-tin-tuc/danh-muc-tin-tuc.component';
import { WebsiteManagerRouting } from './website-manager.route';
import { BaiVietComponent } from './bai-viet/bai-viet.component';

const LIBs = [
    WebsiteManagerRouting,
    TranslateModule,
    GridModule,
    SkeletonModule,
    LayoutModule,
    EmptyModule,
    DragDropModule,
    AscButtonModule,
    IconModule,
    GridControlModule,
    NgxSpinnerModule,
    FormControlModule,
    SelectControlModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingViewModule,

    NzButtonModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzModalModule,
    NzSelectModule,
    NzInputModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzPopoverModule,
    HideIfUnauthorizedModule,
    ValidatorRequiredDirectiveModule,
    WrapFormModule,
];

const UIs = [WebsiteManagerComponent, TinTucComponent];

@NgModule({
    imports: [...LIBs],
    declarations: [...UIs, DanhMucTinTucComponent, BaiVietComponent],
    exports: [...UIs],
})
export class WebsiteManagerModule {}
