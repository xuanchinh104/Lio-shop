import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Receipt, ReceiptDetail, XuatHoaDon } from '@asc/web/shell/data-access/models';
import { CourseWebService, PaymentService } from '@asc/web/shell/data-access/service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { finalize, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '@asc/shared/services/common';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-receipt-detail',
    templateUrl: './receipt-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptDetailComponent {
    @Output() closeForm = new EventEmitter<boolean>();

    readonly receiptId$ = new BehaviorSubject<number | null>(0);

    _receipt!: Receipt | null;
    @Input() set receipt(receipt: Receipt | null) {
        if (receipt) {
            this.receiptId$.next(receipt.idSoThuTrucTuyen);
            this._receipt = receipt;
        }
    }

    receipDetail: ReceiptDetail[] = [];

    isXuatHoaDon = false;

    refresh$ = new BehaviorSubject<boolean>(false);

    state$ = combineLatest([this.receiptId$, this.refresh$]).pipe(shareReplay());

    receipDetail$ = this.state$.pipe(
        switchMap(([id, refresh]) =>
            this.paymentService.getReceiptDetail({
                idSoThuTrucTuyen: id ?? 0,
                isHuy: true,
                metaData: '',
            })
        ),
        tap(res => {
            this.receipDetail = res;
            this.isXuatHoaDon = res[0].isXuatHoaDon;
            this.isDaXuat = res[0].isDaXuat;
            this.cdr.detectChanges();
        })
    );

    isSubmited = false;

    isDaXuat = false;

    private destroyed$ = new Subject();

    constructor(
        private paymentService: PaymentService,
        private spinner: NgxSpinnerService,
        private cdr: ChangeDetectorRef,
        private courseWebService: CourseWebService,
        private notification: NotificationService,
        private translocoService: TranslocoService
    ) {}

    onExportHoaDon(): void {
        this.spinner.show();
        this.isSubmited = true;
        this.cdr.detectChanges();
        this.courseWebService
            .post('XuatHoaDon/CreateInvoice', {
                idSoThuTrucTuyens: [this._receipt?.idSoThuTrucTuyen],
            })
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe((res: XuatHoaDon) => {
                if (res.succeeded) {
                    this.notification.showSuccessMessage(this.translocoService.translate('XUAT_HOA_DON_SUCCESS'));
                } else {
                    this.notification.showErrorMessage(res.message);
                }
                this.refresh$.next(true);
            });
    }

    onViewHoaDon(receipDetails: ReceiptDetail[]): void {
        const receipDetail = receipDetails[0];
        if (receipDetail.filePathInvoice && receipDetail.signStatus === '5') {
            const url = receipDetail.urlInvoice + receipDetail.middleUrl + receipDetail.filePathInvoice;
            window.open(url, '_blank');
        } else {
            this.isSubmited = true;
            this.courseWebService
                .post('XuatHoaDon/GetInfoInvoice', {
                    idSoThuTrucTuyen: this._receipt?.idSoThuTrucTuyen,
                })
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showWarningMessage(this.translocoService.translate('HOA_DON_TRANG_THAI_CHO_KY'));
                    this.refresh$.next(true);
                });
        }
    }

    trackByFunc(index: number): number {
        return index;
    }

    back(): void {
        this.closeForm.emit(true);
    }
}
