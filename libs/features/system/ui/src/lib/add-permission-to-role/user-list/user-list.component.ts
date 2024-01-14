import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AclConstant, UserRoleOfList, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { Observable } from 'rxjs';
import { RbacService } from '@asc/shared/services/common';
import { map, tap } from 'rxjs/operators';
import { SafeEvent } from '@asc/shared/utils';
import { ReziseTable } from '@asc/core/constants';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder } from '@angular/forms';
import { CourseService } from '@asc/features/shell/data-access/service';
import { ModuleTypeEnum } from '@asc/shared/data-access';

@Component({
    selector: 'asc-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent extends BaseSystemListComponent<UserRoleOfList> {
    formSearch = this.formBuilder.group({
        idCoSo: [null],
        idChucVu: [null],
        idPhongBan: [null],
        firstName: [null],
        lastName: [null],
        email: [null],
        phoneNumber: [null],
        isAssignedRole: [null],
    });
    isReload: boolean | null = false;

    @Input() set isRefresh(isReload: boolean | null) {
        if (isReload) {
            this.refresh$.next(true);
        }
    }

    @Output() usersSelected = new EventEmitter<string[]>();
    @Output() isFilterUser = new EventEmitter<boolean>();
    pageHeight = window.innerHeight - ReziseTable;
    idsUserSelected: string[] = [];

    phongBans$ = this.courseService.getPhongBans();

    userTypeDescription = UserTypeDescription;
    userTypeList = UserTypeList;

    userType = UserTypeEnum.NHAN_SU;

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private courseService: CourseService
    ) {
        super(injector);
    }

    selectedRows(e: SafeEvent): void {
        this.usersSelected.emit(this.idsUserSelected);
    }

    onDeselectedAll(): void {
        this.idsUserSelected.length = 0;
    }

    refreshHandler(): void {
        this.formSearch.reset();
    }

    onToggleSearchAdvanced(): void {
        super.onToggleSearchAdvanced();
        this.isFilterUser.emit(this.isSearchAdvanced);
    }

    onChangeUserType(userType: number): void {
        this.refresh$.next(true);
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.rbacService
            .get(AclConstant.ACL_USER_ROLE + '/ListOfUserIncludingRoles', {
                ...this.queryOptions,
                ...this.formSearch.value,
                userType: this.userType,
                keyword,
                moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
            })
            .pipe(
                tap(() => (this.isReload = false)),
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                }))
            );
    }

    protected showFormCreateOrUpdate(): void {
        // Code here
    }
}
