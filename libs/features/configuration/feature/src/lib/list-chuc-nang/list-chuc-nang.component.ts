import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { BaseNzTableList } from '@asc/shared/base';
import { ChucNang, ConfigurationConstant } from '@asc/features/configuration/data-access';
import { MessageConstant, ModalDeleteConfig, ReziseTable } from '@asc/core/constants';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActionEnum } from '@asc/shared/data-access';
import { Observable } from 'rxjs';
import { SafeAny } from '@asc/shared/utils';
import { FormChucNangComponent } from './form-chuc-nang/form-chuc-nang.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-list-chuc-nang',
    templateUrl: './list-chuc-nang.component.html',
    styleUrls: ['./list-chuc-nang.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListChucNangComponent extends BaseNzTableList<ChucNang> implements OnDestroy {
    @Input() idScreen?: number;
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

    removeHandler(dataItem?: ChucNang): void {
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
                        .delete(ConfigurationConstant.ACTION, data)
                        .pipe(
                            switchMap(() => this.loadItems()),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                            this.loadItems();
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

    editHandler(dataItem?: ChucNang): void {
        this.model = dataItem;
        this.action = ActionEnum.UPDATE;
        this.showFormCreateOrUpdate();
    }

    copyHandler(dataItem?: ChucNang): void {
        this.model = dataItem;
        this.action = ActionEnum.DUPLICATE;
        this.showFormCreateOrUpdate();
    }

    close(): void {
        this.ref.close();
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

    protected loadItems(): Observable<SafeAny> {
        this.isLoading = true;
        return this.rbacService
            .get(ConfigurationConstant.ACTION_LIST, {
                ...this.queryOptions,
                idFunction: this.idScreen,
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

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzContent: FormChucNangComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <ChucNang>this.model,
                },
                idFunction: this.idScreen,
            },
            nzWidth: 600,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose.pipe(switchMap(() => this.loadItems())).subscribe();
    }
}
