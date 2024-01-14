import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { BaseNzTableList } from '@asc/shared/base';
import { ConfigurationConstant, NhomManHinh } from '@asc/features/configuration/data-access';
import { MessageConstant, ModalDeleteConfig, ReziseTable } from '@asc/core/constants';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActionEnum } from '@asc/shared/data-access';
import { SafeAny } from '@asc/shared/utils';
import { Observable } from 'rxjs';
import { ListChucNangComponent } from '../list-chuc-nang/list-chuc-nang.component';
import { FormManHinhComponent } from './form-man-hinh/form-man-hinh.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-list-man-hinh',
    templateUrl: './list-man-hinh.component.html',
    styleUrls: ['./list-man-hinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListManHinhComponent extends BaseNzTableList<NhomManHinh> implements OnDestroy {
    @Input() idGroup?: number;

    pageHeight = window.innerHeight - ReziseTable - 350;
    isZoom = false;

    constructor(
        private rbacService: RbacService,
        private modal: NzModalService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef,
        private ref: NzModalRef,
        private translocoService: TranslocoService
    ) {
        super();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /**
     * Removes handler
     * @param dataItem
     */

    removeHandler(dataItem?: NhomManHinh): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        } else {
            this.selectionIds = this.rowSelecteds.map(m => m.id);
        }

        if (this.selectionIds.length > 0) {
            const data = {
                ids: this.selectionIds,
            };
            this.modal.confirm({
                nzTitle: this.translocoService.translate('CF.TITLE'),
                nzContent: this.translocoService.translate('WR.XAC_NHAN_XOA'),
                nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
                nzOkDanger: true,
                nzOnOk: () => {
                    this.rbacService
                        .delete(ConfigurationConstant.FUNCTION, data)
                        .pipe(
                            switchMap(() => this.loadItems()),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                            this.selectionIds = [];
                            this.rowSelecteds = [];
                            this.setOfCheckedId.clear();
                        });
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    addHandler(): void {
        this.model = null;
        this.action = ActionEnum.CREATE;
        this.showFormCreateOrUpdate();
    }

    editHandler(dataItem?: NhomManHinh): void {
        this.model = dataItem;
        this.action = ActionEnum.UPDATE;
        this.showFormCreateOrUpdate();
    }

    copyHandler(dataItem?: NhomManHinh): void {
        this.model = dataItem;
        this.action = ActionEnum.DUPLICATE;
        this.showFormCreateOrUpdate();
    }

    loadItems(): Observable<SafeAny> {
        this.isLoading = true;
        return this.rbacService
            .get(ConfigurationConstant.FUNCTION_LIST, {
                ...this.queryOptions,
                isActive: true,
                idFunctionGroup: this.idGroup,
            })
            .pipe(
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                })),
                tap(res => {
                    this.data = res.data;
                    this.totalItems = res.total;
                }),
                finalize(() => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                })
            );
    }

    showListFunction(dataItem: NhomManHinh): void {
        const modal = this.modal.create({
            nzContent: ListChucNangComponent,
            nzComponentParams: {
                idScreen: dataItem.id,
            },
            nzWidth: 900,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose
            .pipe(
                switchMap(() => this.loadItems()),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    close(): void {
        this.ref.close();
    }

    zoomForm(isZoom: boolean): void {
        if (isZoom) {
            this.ref.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.ref.updateConfig({
                nzWrapClassName: '',
            });
        }
    }

    showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzContent: FormManHinhComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <NhomManHinh>this.model,
                },
                idFunctionGroup: this.idGroup,
            },
            nzWidth: 550,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose
            .pipe(
                switchMap(() => this.loadItems()),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    onZoom(): void {
        this.isZoom = !this.isZoom;
        if (this.isZoom) {
            this.ref.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.ref.updateConfig({
                nzWrapClassName: '',
            });
        }
    }
}
