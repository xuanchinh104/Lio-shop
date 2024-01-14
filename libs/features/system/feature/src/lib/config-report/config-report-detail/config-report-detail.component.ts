import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ConfigReportDetail, ExcelAlignDescription, ExcelAlignList } from '@asc/features/system/data-access/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@asc/shared/services/common';
import { Observable, Subject } from 'rxjs';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConfigReportAddFastComponent } from './config-report-add-fast/config-report-add-fast.component';
import { ModalDeleteConfig } from '@asc/core/constants';
import { TranslocoService } from '@ngneat/transloco';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'asc-config-report-detail',
    templateUrl: './config-report-detail.component.html',
    styleUrls: ['./config-report-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigReportDetailComponent {
    configReportDetails: ConfigReportDetail[] = [];
    idSysBieuMauDynamic!: number;
    configReportBackup: ConfigReportDetail[] = [];
    configReportDetailsDefault: ConfigReportDetail[] = [];

    @Input() set idBieuMau(id: number) {
        if (id) {
            this.loadItem(id);
            this.getDataBackup(id)
                .pipe(takeUntil(this.destroyed$))
                .subscribe(res => (this.configReportBackup = res));
            this.idSysBieuMauDynamic = id;
        }
    }

    isSubmited = false;
    isLoading = false;
    isLoadingBackup = false;

    excelAlignDescription = ExcelAlignDescription;
    excelAlignList = ExcelAlignList;
    modalConfirmRef?: NzModalRef;

    private destroyed$ = new Subject();

    constructor(
        private modal: NzModalService,
        private noti: NotificationService,
        private courseService: CourseService,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService
    ) {}

    addRow(): void {
        const index = this.configReportDetails.filter(x => !x.isDeleted).length;
        const data = {
            id: 0,
            idSysBieuMauDynamic: this.idSysBieuMauDynamic,
            columnName: '',
            columnDisplayName: '',
            columnWidth: 20,
            textAlign: 0,
            ghiChu: '',
            isVisible: true,
            soThuTu: index + 1,
            isDeleted: false,
        };
        this.configReportDetails.splice(index, 0, data);
    }

    removeHandler(rowIndex: number, dataItem: ConfigReportDetail): void {
        if (dataItem.id === 0) {
            this.configReportDetails.splice(rowIndex, 1);
            this.configReportDetails = this.configReportDetails.map((x: ConfigReportDetail, index: number) => ({
                ...x,
                soThuTu: index + 1,
            }));
            this.cdr.detectChanges();
        } else {
            this.configReportDetails[rowIndex].isDeleted = true;
            // Chuyển những item isDeleted = true về cuối mảng.
            this.configReportDetails.push(this.configReportDetails.splice(rowIndex, 1)[0]);

            this.configReportDetails = this.configReportDetails.map((x: ConfigReportDetail, index: number) => ({
                ...x,
                soThuTu: index + 1,
            }));
            this.cdr.detectChanges();
        }
    }

    onSave(): void {
        this.isSubmited = true;
        const chiTiets = this.configReportDetails.map(x => ({
            id: x.id,
            columnName: x.columnName,
            columnDisplayName: x.columnDisplayName,
            textAlign: x.textAlign,
            columnWidth: x.columnWidth,
            ghiChu: x.ghiChu,
            soThuTu: x.soThuTu,
            isVisible: x.isVisible,
            isDeleted: x.isDeleted,
        }));

        const data = {
            idSysBieuMauDynamic: this.idSysBieuMauDynamic,
            chiTiets,
        };

        this.courseService
            .put(CatalogConstant.BIEU_MAU_DYNAMICS + '/Detail', data, true)
            .pipe(
                switchMap(() =>
                    this.getData(this.idSysBieuMauDynamic).pipe(
                        tap(res => {
                            this.configReportDetails = res;
                            this.configReportDetailsDefault = res;
                            this.cdr.detectChanges();
                        })
                    )
                ),
                finalize(() => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.noti.showSuccessMessage(this.translocoService.translate('RP.SAVE_DATA_SUCCESS'));
            });
    }

    addFast(): void {
        const modal = this.modal.create({
            nzContent: ConfigReportAddFastComponent,
            nzComponentParams: {
                idSysBieuMauDynamic: this.idSysBieuMauDynamic,
            },
            nzWidth: 700,
            nzFooter: null,
            nzClosable: false,
            nzMaskClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.loadItem(this.idSysBieuMauDynamic);
            }
        });
    }

    backupReport(): void {
        const data = this.configReportDetails.find(x => x.id === 0);
        const isDeleted = this.configReportDetails.find(x => x.isDeleted);
        const isDrop = JSON.stringify(this.configReportDetails) === JSON.stringify(this.configReportDetailsDefault);
        if (data || isDeleted || !isDrop) {
            this.noti.showWarningMessage(this.translocoService.translate('RP.BACKUP_FORM_WARNING'));
        } else {
            let isModalLoading = false;
            this.modalConfirmRef = this.modal.confirm({
                nzTitle: this.translocoService.translate('RP.BACKUP'),
                nzContent: this.translocoService.translate('RP.BACKUP_FORM_CONFIRM'),
                nzOkText: this.translocoService.translate('RP.BACKUP'),
                nzOnOk: () =>
                    new Promise((resolve, reject) => {
                        isModalLoading = true;
                        this.courseService
                            .post(CatalogConstant.BIEU_MAU_DYNAMICS + '/Backup', {
                                idSysBieuMauDynamic: this.idSysBieuMauDynamic,
                            })
                            .pipe(
                                switchMap(() =>
                                    this.getDataBackup(this.idSysBieuMauDynamic).pipe(tap(res => (this.configReportBackup = res)))
                                ),
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
                                    this.noti.showSuccessMessage(this.translocoService.translate('RP.BACKUP_FORM_SUCCESS'));
                                    this.modalConfirmRef?.close();
                                    this.cdr.detectChanges();
                                },
                                error => {
                                    this.modalConfirmRef?.close();
                                }
                            );
                    }),
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    drop(event: CdkDragDrop<ConfigReportDetail[]>): void {
        moveItemInArray(this.configReportDetails, event.previousIndex, event.currentIndex);
        this.configReportDetails = this.configReportDetails.map((m: ConfigReportDetail, index: number) => ({
            ...m,
            soThuTu: index + 1,
        }));
        this.cdr.detectChanges();
    }

    private loadItem(id: number): void {
        this.getData(id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                this.configReportDetails = res.map(x => ({
                    ...x,
                    isDeleted: false,
                }));
                this.configReportDetailsDefault = res.map(x => ({
                    ...x,
                    isDeleted: false,
                }));
                this.cdr.detectChanges();
            });
    }

    private getData(id: number): Observable<ConfigReportDetail[]> {
        this.isLoading = true;
        return this.courseService.get(CatalogConstant.BIEU_MAU_DYNAMICS + '/' + `${id}`).pipe(
            finalize(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        );
    }

    private getDataBackup(id: number): Observable<ConfigReportDetail[]> {
        this.isLoadingBackup = true;
        return this.courseService
            .get(CatalogConstant.BIEU_MAU_DYNAMICS + '/Backup', {
                idSysBieuMauDynamic: id,
            })
            .pipe(
                finalize(() => {
                    this.isLoadingBackup = false;
                    this.cdr.detectChanges();
                })
            );
    }
}
