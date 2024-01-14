import { ChangeDetectionStrategy, Component, Injector, OnDestroy, ViewChild } from '@angular/core';
import { ActionEnum } from '@asc/shared/data-access';
import { map, takeUntil } from 'rxjs/operators';
import { MessageConstant, ModalDeleteConfig, ReziseTable } from '@asc/core/constants';
import { RoleFormComponent } from '@asc/features/system/ui';
import { Observable, Subject } from 'rxjs';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { AclConstant, RoleOfList } from '@asc/features/system/data-access/models';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { RbacService } from '@asc/shared/services/common';

enum LayoutRoleEnum {
    PageList,
    GridPermission,
    AddUserToRole,
}

@Component({
    selector: 'asc-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent extends BaseSystemListComponent<RoleOfList> implements OnDestroy {
    @ViewChild(GridComponent) private gridRole?: GridComponent;

    roleOfUser: RoleOfList | null = null;
    layoutRoleState = LayoutRoleEnum.PageList;
    layoutRoleEnum = LayoutRoleEnum;

    private role!: RoleOfList | null;
    private parentId?: number;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private rbacService: RbacService) {
        super(injector);
        this.pageHeight = window.innerHeight - ReziseTable;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removeRole(isDelete: boolean): void {
        if (isDelete) {
            this.refresh$.next(true);
        }
    }

    createNewRole(): void {
        this.action = ActionEnum.CREATE;
        this.role = null;
        this.showFormGroupPermission();
    }

    onReload(isClose: boolean): void {
        this.roleOfUser = null;
        this.layoutRoleState = LayoutRoleEnum.PageList;
        if (isClose) {
            this.refresh$.next(true);
        }
    }

    editRole(dataItem: RoleOfList): void {
        this.action = ActionEnum.UPDATE;
        this.role = dataItem;
        this.showFormGroupPermission();
    }

    showFormAddToCreateGroup(dataItem: RoleOfList): void {
        this.roleOfUser = Object.assign({}, dataItem);
        this.layoutRoleState = LayoutRoleEnum.AddUserToRole;
    }

    showFormSetPermissionToGroup(dataItem: RoleOfList): void {
        this.roleOfUser = Object.assign({}, dataItem);
        this.layoutRoleState = LayoutRoleEnum.GridPermission;
    }

    /**
     * Removes handler
     * @param dataItem
     */
    removeHandler(dataItem: RoleOfList): void {
        const request = {
            ids: [dataItem.id],
        };
        this.modal.confirm({
            nzTitle: this.translocoService.translate('WR.TITLE_XOA_VAI_TRO'),
            nzContent: dataItem
                ? this.translocoService.translate('WR.XOA_VAI_TRO', { value: dataItem.name })
                : this.translocoService.translate('WR.XOA_NHIEU_VAI_TRO'),
            nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
            nzOkDanger: true,
            nzOnOk: () => {
                this.rbacService
                    .delete(AclConstant.ACL_ROLE, request)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(() => {
                        this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                        this.refresh$.next(true);
                        this.selectionIds = [];
                    });
            },
            nzCancelText: this.translocoService.translate('LB.NO'),
        });
    }

    /**
     * Loads data via api service
     */
    protected getData(): Observable<GridDataResult> {
        return this.rbacService.get(AclConstant.ACL_ROLE + '/ListRolesByCurrentLoggedInUser', this.queryOptions).pipe(
            map(res => ({
                data: res ? res.items : [],
                total: res ? res.pagingInfo?.totalItems : 0,
            }))
        );
    }

    protected showFormCreateOrUpdate(): void {
        // code here
    }

    private showFormGroupPermission(): void {
        const modal = this.modal.create({
            // nzTitle: this.action === ActionEnum.CREATE ? 'Tạo nhóm quyền' : 'Cập nhật nhóm quyền',
            nzContent: RoleFormComponent,
            nzComponentParams: {
                formState: {
                    data: <RoleOfList>this.role,
                    action: this.action,
                },
                parentId: this.parentId,
            },
            nzWidth: 500,
            nzFooter: null,
            nzClosable: false,
            nzMaskClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(isLoad);
            }
        });
    }
}
