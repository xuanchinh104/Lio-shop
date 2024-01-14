import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { FormControl } from '@angular/forms';
import { AclConstant } from '@asc/features/system/data-access/models';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-add-permission-to-role',
    templateUrl: './add-permission-to-role.component.html',
    styleUrls: ['./add-permission-to-role.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPermissionToRoleComponent implements OnDestroy {
    @Output() backToList = new EventEmitter<boolean>();
    searchControl = new FormControl();

    isFilter = false;
    rolesSelected: string[] = [];
    usersSelected: string[] = [];

    refresh$ = new BehaviorSubject(false);

    pageHeight = window.innerHeight - 280;

    isClose = false;
    private destroyed$ = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private rbacService: RbacService,
        private notification: NotificationService,
        private modal: NzModalService,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    goBack(): void {
        if (this.isClose) {
            this.backToList.emit(true);
        } else {
            this.backToList.emit(false);
        }
    }

    getUsersSelected(ids: string[]): void {
        this.usersSelected = ids;
    }

    getRolesSelected(ids: string[]): void {
        this.rolesSelected = ids;
    }

    onSaveUserRole(isAssignRole: boolean): void {
        if (this.usersSelected.length > 0 && this.rolesSelected.length > 0) {
            const body = {
                idRoles: [...this.rolesSelected],
                idUsers: [...this.usersSelected],
            };
            this.modal.confirm({
                nzTitle: this.translocoService.translate('LB.NOTI'),
                nzContent: isAssignRole ? this.translocoService.translate('LB.PHAN_QUYEN') : this.translocoService.translate('LB.BO_QUYEN'),
                nzOkText: this.translocoService.translate('LB.OK'),
                nzOkDanger: false,
                nzOnOk: () => {
                    if (isAssignRole) {
                        this.rbacService
                            .post(AclConstant.ACL_USER_ROLE + '/AssignRoleToUser', body)
                            .pipe(takeUntil(this.destroyed$))
                            .subscribe(() => {
                                this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_SAVED_DONE);
                                this.refresh$.next(true);
                                this.isClose = true;
                            });
                    } else {
                        this.rbacService
                            .delete(AclConstant.ACL_USER_ROLE + '/RemoveRoleFromUser', body)
                            .pipe(takeUntil(this.destroyed$))
                            .subscribe(() => {
                                this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_SAVED_DONE);
                                this.refresh$.next(true);
                                this.isClose = true;
                            });
                    }
                    this.refresh$.next(false);
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('WR.CHUA_CHON_NHAN_SU_NHOM_QUYEN'));
        }
    }

    isFilterUser(isSearch: boolean): void {
        this.isFilter = isSearch;
    }
}
