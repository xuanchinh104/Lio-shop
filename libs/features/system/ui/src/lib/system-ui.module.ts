import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { TranslateModule } from '@asc/shared/modules/translate';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UsersOfRoleComponent } from './users-of-role/users-of-role.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { AddPermissionToRoleComponent } from './add-permission-to-role/add-permission-to-role.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { RouterModule } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { IconModule } from '@asc/shared/ui/icon';
import { UserListComponent } from './add-permission-to-role/user-list/user-list.component';
import { RoleListComponent } from './add-permission-to-role/role-list/role-list.component';
import { CreateDefaultPasswordComponent } from './create-default-password/create-default-password.component';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { GridControlModule } from '@asc/shared/ui/grid-control';
import { UserFormComponent } from './user-form/user-form.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImportSystemDictionaryFormComponent } from './import-system-dictionary-form/import-system-dictionary-form.component';
import { SystemDictionaryFormComponent } from './system-dictionary-form/system-dictionary-form.component';
import { FileTypeModule } from '@asc/shared/pipes/file-type';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';
import { AddPermissionToRoleDepartmentComponent } from './add-permission-to-role-department/add-permission-to-role-department.component';
import { UserDepartmentListComponent } from './add-permission-to-role-department/user-department-list/user-department-list.component';
import { RoleDepartmentListComponent } from './add-permission-to-role-department/role-department-list/role-department-list.component';

const LIBs = [
    GridModule,
    LayoutModule,
    AscButtonModule,
    FormControlModule,
    TranslateModule,
    IconModule,
    SafeHtmlPipeModule,
    ValidatorRequiredDirectiveModule,
    SelectControlModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    WrapFormModule,
    GridControlModule,
    CKEditorModule,
    FileTypeModule,
    ConvertUrlPipeModule,

    NzModalModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzDropDownModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzTableModule,
    NzTabsModule,
    NzCheckboxModule,
];

const UIs = [
    UserChangePasswordComponent,
    AddPermissionToRoleComponent,
    RoleFormComponent,
    UsersOfRoleComponent,
    MenuLeftComponent,
    UserListComponent,
    RoleListComponent,
    CreateDefaultPasswordComponent,
    UserFormComponent,
    ImportSystemDictionaryFormComponent,
    SystemDictionaryFormComponent,
];

@NgModule({
    imports: [CommonModule, ...LIBs],
    declarations: [...UIs, AddPermissionToRoleDepartmentComponent, UserDepartmentListComponent, RoleDepartmentListComponent],
    exports: [...UIs, AddPermissionToRoleDepartmentComponent],
    providers: [],
})
export class SystemUIModule {}
