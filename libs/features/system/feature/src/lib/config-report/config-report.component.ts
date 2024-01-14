import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { ConfigReport } from '@asc/features/system/data-access/models';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, Subject } from 'rxjs';
import { FormConfigReportComponent } from './form-config-report/form-config-report.component';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-config-report',
    templateUrl: './config-report.component.html',
    styleUrls: ['./config-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigReportComponent extends BaseSystemListComponent<ConfigReport> {
    @ViewChild(GridComponent) private gridData?: GridComponent;
    modalConfirmRef?: NzModalRef;
    private destroyed$ = new Subject();

    constructor(injector: Injector, private courseService: CourseService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    onDeselectedAll(): void {
        this.selectionIds.length = 0;
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.courseService
            .get(CatalogConstant.BIEU_MAU_DYNAMICS, {
                ...this.queryOptions,
                keyword,
            })
            .pipe(
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                }))
            );
    }

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzContent: FormConfigReportComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <ConfigReport>this.model,
                },
            },
            nzWidth: 800,
            nzFooter: null,
            nzClosable: false,
            nzMaskClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(isLoad);
                this.gridData?.collapseRow(this.rowDetailIndex);
                this.cdr.detectChanges();
            }
        });
    }

    removeHandler(dataItem?: ConfigReport): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            const data = {
                ids: this.selectionIds,
            };
            let isModalLoading = false;
            this.modalConfirmRef = this.modal.confirm({
                nzTitle: this.translocoService.translate('LB.NOTI'),
                nzContent: dataItem
                    ? this.translocoService.translate('WR.XOA_BIEU_MAU', { value: dataItem.ten })
                    : this.translocoService.translate('WR.XOA_NHIEU_BIEU_MAU'),
                nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
                nzOkDanger: true,
                nzOnOk: () =>
                    new Promise((resolve, reject) => {
                        isModalLoading = true;
                        this.courseService
                            .delete(CatalogConstant.BIEU_MAU_DYNAMICS, data)
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
                                this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                                this.refresh$.next(true);
                                this.selectionIds = [];
                                this.modalConfirmRef?.close();
                                this.gridData?.collapseRow(this.rowDetailIndex);
                                this.cdr.detectChanges();
                            });
                    }),
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    initialSetting(dataItem: ConfigReport): void {
        this.selectionIds = [];
        this.selectionIds.push(dataItem.id);
        let isModalLoading = false;
        this.modalConfirmRef = this.modal.confirm({
            nzTitle: this.translocoService.translate('RP.RESTORE_FORM'),
            nzContent: this.translocoService.translate('RP.RESTORE_CONTENT'),
            nzOkText: this.translocoService.translate('RP.SETTING'),
            nzOnOk: () =>
                new Promise((resolve, reject) => {
                    isModalLoading = true;
                    this.courseService
                        .post(CatalogConstant.BIEU_MAU_DYNAMICS + '/Restore', {
                            idSysBieuMauDynamic: dataItem.id,
                        })
                        .pipe(
                            finalize(() => {
                                isModalLoading = false;
                                this.modalConfirmRef?.updateConfig({
                                    nzOkLoading: isModalLoading,
                                });
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(
                            () => {
                                this.notification.showSuccessMessage(this.translocoService.translate('RP.RESTORE_SUCCESS'));
                                this.modalConfirmRef?.close();
                                this.gridData?.collapseRow(this.rowDetailIndex);
                                this.cdr.detectChanges();
                            },
                            error => {
                                this.modalConfirmRef?.close();
                                this.gridData?.collapseRow(this.rowDetailIndex);
                                this.cdr.detectChanges();
                            }
                        );
                }),
            nzCancelText: this.translocoService.translate('LB.NO'),
        });
    }
}
