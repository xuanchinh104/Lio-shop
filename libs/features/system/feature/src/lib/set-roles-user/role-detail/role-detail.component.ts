import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AclConstant, UserRoleOfList } from '@asc/features/system/data-access/models';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { TranslocoService } from '@ngneat/transloco';

export interface RoleDetail {
    id: string;
    label: string;
}

@Component({
    selector: 'asc-role-detail',
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDetailComponent implements OnDestroy {
    @Output() isDelete = new EventEmitter<boolean>();

    permissionList: RoleDetail[] = [];
    userId = '';

    @Input() set role(userRole: UserRoleOfList) {
        this.userId = userRole.id;
        if (userRole.roles) {
            this.permissionList = userRole.roles.split('|').map(item => {
                const [id, label] = item.split(',');
                return {
                    id,
                    label,
                };
            });
        }
    }

    private destroyed$ = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private modal: NzModalService,
        private rbacService: RbacService,
        private notification: NotificationService,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removePermissionItem(idItem: string): void {
        const data = {
            idRoles: [idItem],
            idUsers: [this.userId],
        };

        this.modal.confirm({
            nzTitle: this.translocoService.translate('LB.NOTI'),
            nzContent: this.translocoService.translate('LB.BO_PHAN_QUYEN'),
            nzOkText: this.translocoService.translate('LB.OK'),
            nzOkDanger: true,
            nzOnOk: () => {
                this.rbacService
                    .delete(AclConstant.ACL_USER_ROLE + '/RemoveRoleFromUser', data)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(() => {
                        this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_SAVED_DONE);
                        this.removeRole(idItem);
                        this.isDelete.emit(true);
                        this.cdr.detectChanges();
                    });
            },
            nzCancelText: this.translocoService.translate('LB.NO'),
        });
    }

    private removeRole(idRole: string): RoleDetail[] {
        const idx = this.permissionList.findIndex(m => m.id === idRole);
        if (idx > -1) {
            return this.permissionList.splice(idx, 1);
        }
        return this.permissionList;
    }
}
