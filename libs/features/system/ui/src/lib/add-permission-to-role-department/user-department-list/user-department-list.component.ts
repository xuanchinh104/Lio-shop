import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { UserRoleOfList, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { ReziseTable } from '@asc/core/constants';
import { FormBuilder } from '@angular/forms';
import { SafeEvent } from '@asc/shared/utils';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { map, tap } from 'rxjs/operators';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CatalogConstant } from '@asc/features/catalog/data-access';

@Component({
    selector: 'asc-user-department-list',
    templateUrl: './user-department-list.component.html',
    styleUrls: ['./user-department-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDepartmentListComponent extends BaseSystemListComponent<UserRoleOfList> {
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
            this.cdr.detectChanges();
        }
    }

    @Output() usersSelected = new EventEmitter<number[]>();
    @Output() isFilterUser = new EventEmitter<boolean>();
    pageHeight = window.innerHeight - ReziseTable;
    idsUserSelected: number[] = [];

    userTypeDescription = UserTypeDescription;
    userTypeList = UserTypeList;

    userType = UserTypeEnum.NHAN_SU;

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
        private courseService: CourseService,
        private cdr: ChangeDetectorRef
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
        return this.courseService
            .get(CatalogConstant.PHONG_BAN_QUAN_LY + '/ListUserDepartment', {
                ...this.queryOptions,
                ...this.formSearch.value,
                userType: this.userType,
                keyword,
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
