import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ReportUtil, SafeAny } from '@asc/shared/utils';
import { of, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslocoService } from '@ngneat/transloco';
import { CourseService } from '@asc/features/shell/data-access/service';
import { NotificationService } from '@asc/shared/services/common';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'asc-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss'],
})
export class ImportDataComponent implements OnDestroy {
    @ViewChild('fileInput') fileInput?: ElementRef | null;
    @Input() title!: string;

    @Input() mauImport!: string;

    @Input() apiUrl!: string;

    _idLopHoc!: number;
    @Input() set idLopHoc(val: number) {
        if (val) {
            this._idLopHoc = val;
        }
    }

    @Input() isXepLoai!: SafeAny;

    fileAttach!: SafeAny;
    isSubmited = false;
    rowError = 0;
    fileExt = ['xls', 'xlsx', 'csv', 'ods'];
    fileAccept = this.fileExt.map(x => '.' + x).join(',');

    private destroyed$ = new Subject();

    constructor(
        private modalRef: NzModalRef,
        private cdr: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private translocoService: TranslocoService,
        private courseService: CourseService,
        private notification: NotificationService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    uploadFile($event: SafeAny): void {
        this.rowError = 0;
        const file = $event.target.files;
        const fileType = file[0].name.split('.').pop();
        const isLt20MB = this.isMaximumSize(file[0]);
        if (!isLt20MB) {
            if (file && file.length > 0) {
                if (this.fileExt.includes(fileType)) {
                    this.fileAttach = file[0];
                } else {
                    this.notification.showWarningMessage(this.translocoService.translate('IMPORT.FILE_NOT_SUPPORT'));
                }
            }
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('IMPORT.FILE_OVER_SIZE'));
        }
    }

    exportTemplate(): void {
        this.spinner.show();
        this.cdr.detectChanges();
        this.courseService
            .onExportData(CatalogConstant.BIEU_MAU + `/${this.mauImport}`, {
                idLopHoc: this._idLopHoc,
            })
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    onSubmit(): void {
        const formData = new FormData();
        formData.append('file', this.fileAttach);
        if (this._idLopHoc) {
            formData.append('idLopHoc', this._idLopHoc.toString());
            formData.append('isXepLoai', this.isXepLoai);
        }
        this.isSubmited = true;
        this.courseService
            .post(this.apiUrl + '/CheckImport', formData, true)
            .pipe(
                switchMap(res => {
                    if (res.tongSoDongKhongHopLe > 0) {
                        this.rowError = res.tongSoDongKhongHopLe;
                        if (this.fileInput) {
                            this.fileInput.nativeElement.value = null;
                        }
                        return of(false);
                    } else {
                        this.rowError = 0;
                        return this.courseService.post(this.apiUrl + '/Import', formData, true).pipe(map(() => true));
                    }
                }),
                finalize(() => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe((res: boolean) => {
                this.isSubmited = false;
                this.cdr.detectChanges();
                if (res) {
                    this.notification.showSuccessMessage(this.translocoService.translate('IMPORT.SUCCESS'));
                    this.closeForm();
                }
            });
    }

    downloadFileError(): void {
        this.spinner.show();
        this.cdr.detectChanges();
        const formData = new FormData();
        formData.append('file', this.fileAttach);
        if (this._idLopHoc) {
            formData.append('idLopHoc', this._idLopHoc.toString());
        }
        this.courseService
            .download(this.apiUrl + '/Import', formData)
            .pipe(
                tap(res => {
                    ReportUtil.downloadWithContenDiposition(res);
                }),
                finalize(() => {
                    this.spinner.hide();
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    closeForm(result = false): void {
        this.modalRef.close(result);
    }

    zoomForm(isZoom: boolean): void {
        if (isZoom) {
            this.modalRef.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.modalRef.updateConfig({
                nzWrapClassName: '',
            });
        }
    }

    filesDropped($event: SafeAny): void {
        this.rowError = 0;
        const file = $event[0];
        const isLt20MB = this.isMaximumSize(file);
        if (!isLt20MB) {
            const fileType = file.name.split('.').pop();
            if (this.fileExt.includes(fileType)) {
                this.fileAttach = file;
            } else {
                this.notification.showWarningMessage(this.translocoService.translate('IMPORT.FILE_NOT_SUPPORT'));
            }
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('IMPORT.FILE_OVER_SIZE'));
        }
    }

    private isMaximumSize(file: SafeAny): boolean {
        return file.size / 1024 / 1024 > 20;
    }
}
