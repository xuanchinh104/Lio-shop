import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { SystemRouting } from './system.routing';
import { UserListComponent } from './user-list/user-list.component';
import { SystemUIModule } from '@asc/features/system/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GridModule } from '@progress/kendo-angular-grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SetRolesUserComponent } from './set-roles-user/set-roles-user.component';

import { RoleListComponent } from './role-list/role-list.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { OverflowBodyModule } from '@asc/shared/directives/overflow-body';
import { SkeletonModule } from '@asc/shared/ui/skeleton';
import { IconModule } from '@asc/shared/ui/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { HeaderModule } from '@asc/features/shell/ui/header';
import { EmptyModule } from '@asc/features/shell/ui/empty';
import { RoleDetailComponent } from './set-roles-user/role-detail/role-detail.component';
import { GridPermissionComponent } from './role-list/grid-permission/grid-permission.component';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { AscButtonModule } from '@asc/shared/ui/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AddUserToRoleComponent } from './role-list/add-user-to-role/add-user-to-role.component';
import { UserSyncComponent } from './user-sync/user-sync.component';
import { GridControlModule } from '@asc/shared/ui/grid-control';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { ConfigSendMailComponent } from './config-send-mail/config-send-mail.component';
import { ConfigContentMailComponent } from './config-content-mail/config-content-mail.component';
import { SystemDictionaryComponent } from './system-dictionary/system-dictionary.component';
import { ConfigReportComponent } from './config-report/config-report.component';
import { ConfigReportDetailComponent } from './config-report/config-report-detail/config-report-detail.component';
import { FormConfigReportComponent } from './config-report/form-config-report/form-config-report.component';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ConfigReportAddFastComponent } from './config-report/config-report-detail/config-report-add-fast/config-report-add-fast.component';
import { NotfoundTplModule } from '@asc/shared/ui/notfound-tpl';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ConfigReportInitialComponent } from './config-report/config-report-detail/config-report-initial/config-report-initial.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SetRolesDepartmentComponent } from './set-roles-department/set-roles-department.component';
import { RoleDepartmentDetailComponent } from './set-roles-department/role-department-detail/role-department-detail.component';

const LIBs = [
    NzTableModule,
    NzSelectModule,
    NzDatePickerModule,
    NzRadioModule,
    NzModalModule,
    NzDropDownModule,
    NzInputNumberModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    GridModule,
    TranslocoModule,
    SafeHtmlPipeModule,
    OverflowBodyModule,
    SkeletonModule,
    IconModule,
    HeaderModule,
    EmptyModule,
    AscButtonModule,
    GridControlModule,
    FormControlModule,
    SelectControlModule,
    ValidatorRequiredDirectiveModule,
];

@NgModule({
    imports: [
        CommonModule,
        SystemUIModule,
        SystemRouting,
        FormsModule,
        ReactiveFormsModule,
        ...LIBs,
        WrapFormModule,
        NzToolTipModule,
        NotfoundTplModule,
        NzPopoverModule,
        NzTabsModule,
        DragDropModule,
    ],
    declarations: [
        SystemComponent,
        UserListComponent,
        SetRolesUserComponent,
        RoleListComponent,
        RoleDetailComponent,
        GridPermissionComponent,
        AddUserToRoleComponent,
        UserSyncComponent,
        ConfigSendMailComponent,
        ConfigContentMailComponent,
        SystemDictionaryComponent,
        ConfigReportComponent,
        ConfigReportDetailComponent,
        FormConfigReportComponent,
        ConfigReportAddFastComponent,
        ConfigReportInitialComponent,
        SetRolesDepartmentComponent,
        RoleDepartmentDetailComponent,
    ],
    exports: [RoleListComponent, UserListComponent],
})
export class SystemModule {}
