import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PhongBanQuanLy } from '@asc/features/system/data-access/models';
import { Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@asc/shared/services/common';
import { CourseService } from '@asc/features/shell/data-access/service';
import { finalize, takeUntil } from 'rxjs/operators';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { TranslocoService } from '@ngneat/transloco';

export interface DepartmentDetail {
    id: string;
    label: string;
}

@Component({
    selector: 'asc-role-department-detail',
    templateUrl: './role-department-detail.component.html',
    styleUrls: ['./role-department-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDepartmentDetailComponent implements OnDestroy {
    @Output() isDelete = new EventEmitter<boolean>();

    permissionList: DepartmentDetail[] = [];
    userId!: number;

    @Input() set role(department: PhongBanQuanLy) {
        this.userId = department.id;
        if (department.phongBans) {
            this.permissionList = department.phongBans.split('|').map(item => {
                const [id, label] = item.split(',');
                return {
                    id,
                    label,
                };
            });
        }
    }

    modalConfirmRef?: NzModalRef;

    private destroyed$ = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private modal: NzModalService,
        private courseService: CourseService,
        private notification: NotificationService,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removePermissionItem(idItem: string): void {
        const data = {
            idPhongBans: [Number(idItem)],
            idUsers: [this.userId],
        };

        let isModalLoading = false;
        this.modalConfirmRef = this.modal.confirm({
            nzTitle: this.translocoService.translate('LB.NOTI'),
            nzContent: this.translocoService.translate('LB.BO_PHAN_QUYEN'),
            nzOkText: this.translocoService.translate('LB.OK'),
            nzOkDanger: true,
            nzOnOk: () =>
                new Promise(() => {
                    isModalLoading = true;
                    this.courseService
                        .delete(CatalogConstant.PHONG_BAN_QUAN_LY, data)
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
                            this.notification.showSuccessMessage(this.translocoService.translate('LB.LUU_THAY_DOI_SUCCESS'));
                            this.removeRole(idItem);
                            this.isDelete.emit(true);
                            this.modalConfirmRef?.close();
                            this.cdr.detectChanges();
                        });
                }),
            nzCancelText: this.translocoService.translate('LB.NO'),
        });
    }

    private removeRole(idRole: string): DepartmentDetail[] {
        const idx = this.permissionList.findIndex(m => m.id === idRole);
        if (idx > -1) {
            return this.permissionList.splice(idx, 1);
        }
        return this.permissionList;
    }
}
