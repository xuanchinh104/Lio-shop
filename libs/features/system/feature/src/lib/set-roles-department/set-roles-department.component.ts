import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Injector, OnDestroy } from '@angular/core';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CustomVirtualScrollStrategy } from '@asc/features/system/data-access/service';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { UserRoleOfList, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { Observable, Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ReziseTable } from '@asc/core/constants';
import { SafeAny } from '@asc/shared/utils';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { map } from 'rxjs/operators';

enum LayoutRoleEnum {
    PageList,
    SetRoleToUser,
}

@Component({
    selector: 'asc-set-roles-department',
    templateUrl: './set-roles-department.component.html',
    styleUrls: ['./set-roles-department.component.scss'],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useClass: CustomVirtualScrollStrategy,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetRolesDepartmentComponent extends BaseSystemListComponent<UserRoleOfList> implements OnDestroy {
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
    layoutRoleEnum = LayoutRoleEnum;
    layoutRoleState = LayoutRoleEnum.PageList;
    userTypeDescription = UserTypeDescription;
    userTypeList = UserTypeList;

    userType = UserTypeEnum.NHAN_SU;

    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private courseService: CourseService,
        injector: Injector,
        private cdr: ChangeDetectorRef
    ) {
        super(injector);
        this.pageHeight = window.innerHeight - ReziseTable;
    }

    @HostListener('window:resize', ['$event'])
    onResize(e: SafeAny): void {
        this.pageHeight = window.innerHeight - ReziseTable;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    showViewSetRoleToUser(): void {
        this.layoutRoleState = LayoutRoleEnum.SetRoleToUser;
    }

    onClose(isClose: boolean): void {
        if (isClose) {
            this.refresh$.next(true);
        }
        this.layoutRoleState = LayoutRoleEnum.PageList;
    }

    refreshHandler(): void {
        this.formSearch.reset();
    }

    removeRole(isDelete: boolean): void {
        if (isDelete) {
            this.refresh$.next(true);
            this.cdr.detectChanges();
        }
    }

    refreshView(): void {
        this.searchControl.setValue('');
    }

    onChangeUserType(userType: number): void {
        this.refresh$.next(true);
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.courseService
            .get(CatalogConstant.PHONG_BAN_QUAN_LY + '/ListUserDepartment', {
                ...this.queryOptions,
                userType: this.userType,
                keyword,
            })
            .pipe(
                map(res => ({
                    data: res.items ?? [],
                    total: res.pagingInfo?.totalItems,
                }))
            );
    }

    protected showFormCreateOrUpdate(): void {
        // code here
    }
}
