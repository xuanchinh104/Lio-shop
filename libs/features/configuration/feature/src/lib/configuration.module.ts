import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { RouterModule } from '@angular/router';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TranslocoModule } from '@ngneat/transloco';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NhomManHinhComponent } from './nhom-man-hinh/nhom-man-hinh.component';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { FormNhomManHinhComponent } from './nhom-man-hinh/form-nhom-man-hinh/form-nhom-man-hinh.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { GridModule } from '@progress/kendo-angular-grid';
import { EmptyModule } from '@asc/features/shell/ui/empty';
import { SkeletonModule } from '@asc/shared/ui/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ListManHinhComponent } from './list-man-hinh/list-man-hinh.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ListChucNangComponent } from './list-chuc-nang/list-chuc-nang.component';
import { FormManHinhComponent } from './list-man-hinh/form-man-hinh/form-man-hinh.component';
import { FormChucNangComponent } from './list-chuc-nang/form-chuc-nang/form-chuc-nang.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { GridControlModule } from '@asc/shared/ui/grid-control';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ConfigurationComponent,
            },
        ]),
        TreeViewModule,
        NzDropDownModule,
        TranslocoModule,
        NzIconModule,
        NzInputNumberModule,
        AscButtonModule,
        FormControlModule,
        ReactiveFormsModule,
        SvgIconsModule,
        GridModule,
        EmptyModule,
        SkeletonModule,
        NzToolTipModule,
        NzSelectModule,
        NzCheckboxModule,
        NzTableModule,
        NzRadioModule,
        WrapFormModule,
        GridControlModule,
        ValidatorRequiredDirectiveModule,
    ],
    declarations: [
        ConfigurationComponent,
        TreeViewComponent,
        NhomManHinhComponent,
        FormConfigurationComponent,
        FormNhomManHinhComponent,
        ListManHinhComponent,
        ListChucNangComponent,
        FormManHinhComponent,
        FormChucNangComponent,
    ],
})
export class ConfigurationModule {}
