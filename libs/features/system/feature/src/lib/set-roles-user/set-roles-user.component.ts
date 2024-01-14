import { ChangeDetectionStrategy, Component, HostListener, Injector, OnDestroy } from '@angular/core';
import { CustomVirtualScrollStrategy } from '@asc/features/system/data-access/service';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ReziseTable } from '@asc/core/constants';
import { SafeAny } from '@asc/shared/utils';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, Subject } from 'rxjs';
import { AclConstant, UserRoleOfList, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { RbacService } from '@asc/shared/services/common';
import { FormBuilder } from '@angular/forms';
import { ModuleTypeEnum } from '@asc/shared/data-access';

enum LayoutRoleEnum {
    PageList,
    SetRoleToUser,
}

@Component({
    selector: 'asc-set-roles-user',
    templateUrl: './set-roles-user.component.html',
    styleUrls: ['./set-roles-user.component.scss'],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useClass: CustomVirtualScrollStrategy,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetRolesUserComponent extends BaseSystemListComponent<UserRoleOfList> implements OnDestroy {
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

    constructor(private rbacService: RbacService, private formBuilder: FormBuilder, private router: Router, injector: Injector) {
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
        }
    }

    onChangeUserType(userType: number): void {
        this.refresh$.next(true);
    }

    protected getData(): Observable<GridDataResult> {
        return this.rbacService
            .get(AclConstant.ACL_USER_ROLE + '/ListOfUserIncludingRoles', {
                ...this.queryOptions,
                ...this.formSearch.value,
                userType: this.userType,
                moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
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
