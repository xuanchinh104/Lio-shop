import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotificationService } from '@asc/shared/services/common';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-add-permission-to-role-department',
    templateUrl: './add-permission-to-role-department.component.html',
    styleUrls: ['./add-permission-to-role-department.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPermissionToRoleDepartmentComponent implements OnDestroy {
    @Output() backToList = new EventEmitter<boolean>();
    searchControl = new FormControl();

    isFilter = false;
    rolesSelected: number[] = [];
    usersSelected: number[] = [];

    refresh$ = new BehaviorSubject(false);

    pageHeight = window.innerHeight - 280;

    isClose = false;

    modalConfirmRef?: NzModalRef;
    private destroyed$ = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        private modal: NzModalService,
        private courseService: CourseService,
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
        this.cdr.detectChanges();
    }

    getUsersSelected(ids: number[]): void {
        this.usersSelected = ids;
    }

    getRolesSelected(ids: number[]): void {
        this.rolesSelected = ids;
    }

    onSaveUserRole(isAssignRole: boolean): void {
        if (this.usersSelected.length > 0 && this.rolesSelected.length > 0) {
            const dataThemQuyen = {
                listIdUser: [...this.usersSelected],
                listIdPhongBan: [...this.rolesSelected],
            };

            const dataBoQuyen = {
                idUsers: [...this.usersSelected],
                idPhongBans: [...this.rolesSelected],
            };
            let isModalLoading = false;
            this.modalConfirmRef = this.modal.confirm({
                nzTitle: this.translocoService.translate('LB.NOTI'),
                nzContent: isAssignRole ? this.translocoService.translate('LB.PHAN_QUYEN') : this.translocoService.translate('LB.BO_QUYEN'),
                nzOkText: this.translocoService.translate('LB.OK'),
                nzOkDanger: false,
                nzOnOk: () =>
                    new Promise(() => {
                        isModalLoading = true;
                        if (isAssignRole) {
                            this.courseService
                                .post(CatalogConstant.PHONG_BAN_QUAN_LY, dataThemQuyen)
                                .pipe(
                                    finalize(() => {
                                        isModalLoading = false;
                                        this.modalConfirmRef?.updateConfig({
                                            nzOkLoading: isModalLoading,
                                        });
                                    }),
                                    takeUntil(this.destroyed$)
                                )
                                .subscribe(() => {
                                    this.notification.showSuccessMessage(this.translocoService.translate('LB.PHAN_QUYEN_THANH_CONG'));
                                    this.refresh$.next(true);
                                    this.modalConfirmRef?.close();
                                    this.isClose = true;
                                    this.cdr.detectChanges();
                                });
                        } else {
                            this.courseService
                                .delete(CatalogConstant.PHONG_BAN_QUAN_LY, dataBoQuyen)
                                .pipe(
                                    finalize(() => {
                                        isModalLoading = false;
                                        this.modalConfirmRef?.updateConfig({
                                            nzOkLoading: isModalLoading,
                                        });
                                    }),
                                    takeUntil(this.destroyed$)
                                )
                                .subscribe(() => {
                                    this.notification.showSuccessMessage(this.translocoService.translate('LB.BO_QUYEN_THANH_CONG'));
                                    this.refresh$.next(true);
                                    this.modalConfirmRef?.close();
                                    this.isClose = true;
                                    this.cdr.detectChanges();
                                });
                        }
                        this.refresh$.next(false);
                    }),
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('LB.CHUA_CHON_NHAN_SU_PHONG_BAN'));
        }
    }

    isFilterUser(isSearch: boolean): void {
        this.isFilter = isSearch;
    }
}
