import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnDestroy, Output } from '@angular/core';
import { RbacService } from '@asc/shared/services/common';
import { FormBuilder } from '@angular/forms';
import { finalize, map, takeUntil } from 'rxjs/operators';
import {
    AclConstant,
    RoleOfList,
    UserOfList,
    UserTypeDescription,
    UserTypeEnum,
    UserTypeList,
} from '@asc/features/system/data-access/models';
import { Observable, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { ModuleTypeEnum } from '@asc/shared/data-access';

@Component({
    selector: 'asc-add-user-to-role',
    templateUrl: './add-user-to-role.component.html',
    styleUrls: ['./add-user-to-role.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserToRoleComponent extends BaseSystemListComponent<UserOfList> implements OnDestroy {
    _role: RoleOfList | null = null;
    @Input() set role(value: RoleOfList) {
        if (value) {
            this._role = value;
        }
    }

    @Output() back = new EventEmitter<boolean>();
    isSubmited = false;

    userTypeDescription = UserTypeDescription;
    userTypeList = UserTypeList;

    userType = UserTypeEnum.NHAN_SU;

    private destroyed$ = new Subject();

    constructor(private rbacService: RbacService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, injector: Injector) {
        super(injector);
        this.pageHeight = window.innerHeight - 200;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    rollBackView(isClose: boolean): void {
        this.back.emit(isClose);
    }

    onSubmit(): void {
        if (this.selectionIds.length > 0) {
            const data = {
                idRole: this._role?.id,
                idUsers: this.selectionIds,
            };
            this.isSubmited = true;
            this.rbacService
                .post(AclConstant.ACL_USER_ASSIGNED_ROLE, data)
                .pipe(
                    finalize(() => {
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showSuccessMessage('Thêm người dùng tạo nhóm thành công');
                    this.rollBackView(true);
                });
        } else {
            this.notification.showWarningMessage('Chưa chọn người dùng !');
        }
    }

    onChangeUserType(userType: number): void {
        this.refresh$.next(true);
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.rbacService
            .get(AclConstant.ACL_USER + '/ListOfUser', {
                ...this.queryOptions,
                isActive: true,
                userType: this.userType,
                moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
            })
            .pipe(
                map((res: any) => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                }))
            );
    }

    protected showFormCreateOrUpdate(): void {
        // code here
    }
}
