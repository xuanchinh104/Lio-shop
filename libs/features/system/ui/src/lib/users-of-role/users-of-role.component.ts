import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnDestroy, Output } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { AclConstant, User, UserOfList } from '@asc/features/system/data-access/models';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { Observable, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { RbacService } from '@asc/shared/services/common';

@Component({
    selector: 'asc-users-of-role',
    templateUrl: './users-of-role.component.html',
    styleUrls: ['./users-of-role.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersOfRoleComponent extends BaseSystemListComponent<UserOfList> implements OnDestroy {
    @Input() idRole?: number;
    @Input() isCreate = false;

    @Output() isDelete = new EventEmitter<boolean>();

    private destroyed$ = new Subject();

    constructor(private rbacService: RbacService, injector: Injector) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removeHandler(dataItem?: User): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }
        if (this.selectionIds.length > 0) {
            const body = {
                idRole: this.idRole,
                idUsers: this.selectionIds,
            };
            this.modal.confirm({
                nzTitle: this.translocoService.translate('LB.DELETE_TITLE'),
                nzContent: this.translocoService.translate('WR.XAC_NHAN_XOA'),
                nzOkText: this.translocoService.translate('LB.OK'),
                nzOkDanger: true,
                nzOnOk: () => {
                    this.rbacService
                        .delete(AclConstant.ACL_USER_ASSIGNED_ROLE, body)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                            this.selectionIds = [];
                            this.refresh$.next(true);
                            this.isDelete.emit(true);
                        });
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.rbacService
            .get(AclConstant.ACL_USER_ASSIGNED_ROLE + '/ListOfDelegator', {
                pageNumber: this.gridState.take && this.gridState.skip ? this.gridState.skip / this.gridState.take + 1 : 0,
                pageSize: this.gridState.take,
                idRole: this.idRole,
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
