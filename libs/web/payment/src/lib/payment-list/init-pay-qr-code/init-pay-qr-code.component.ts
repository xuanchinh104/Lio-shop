import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MetaData } from '@asc/web/shell/data-access/models';
import { DateUtil, ObjectUtil, SafeAny } from '@asc/shared/utils';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { NotificationService } from '@asc/shared/services/common';
import { CODE_COURSE_DYNAMIC } from '@asc/features/shell/data-access/state';

@Component({
    selector: 'asc-init-pay-qr-code',
    templateUrl: './init-pay-qr-code.component.html',
    styleUrls: ['./init-pay-qr-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitPayQRCodeComponent implements OnInit, OnDestroy {
    _dataQRCode!: MetaData;
    @Input() set dataQRCode(val: MetaData) {
        if (val) {
            this._dataQRCode = val;
            this.cdr.detectChanges();
        }
    }

    countdownSubscription!: Subscription;
    seconds!: string;
    minutes!: string;

    private destroyed$ = new Subject();

    constructor(
        private courseService: CourseService,
        private modalRef: NzModalRef,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.countdown();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        this.countdownSubscription.unsubscribe();
    }

    get titleKey(): string {
        return 'Thanh toán QR code';
    }

    closeForm(result = false): void {
        this.modalRef.close(result);
        this.countdownSubscription.unsubscribe();
    }

    countdown(): void {
        this._dataQRCode.period = this._dataQRCode.period * 1000;
        let elapsedSeconds = 0;

        this.countdownSubscription = interval(1000).subscribe(() => {
            if (this._dataQRCode.period > 0) {
                this._dataQRCode.period -= 1000;
                elapsedSeconds++;

                const seconds = Math.floor((this._dataQRCode.period / 1000) % 60)
                    .toString()
                    .padStart(2, '0');
                const minutes = Math.floor((this._dataQRCode.period / (1000 * 60)) % 60)
                    .toString()
                    .padStart(2, '0');
                this.seconds = seconds;
                this.minutes = minutes;

                if (elapsedSeconds % 10 === 0) {
                    this.getTimeLeftQRCode(this._dataQRCode.virtualAcctId).subscribe(
                        result => {
                            if (result) {
                                this.countdownSubscription.unsubscribe();
                                this.notification.showSuccessMessage('Thanh toán thành công');
                                this.closeForm(true);
                                // Handle the result as needed
                            }
                        },
                        error => {
                            console.error('Error calling getTimeLeftQRCode:', error);
                        }
                    );
                }

                this.cdr.detectChanges();
            } else {
                this.countdownSubscription.unsubscribe();
                this.notification.showWarningMessage('Hết thời gian thanh toán !');
                this.closeForm();
            }
        });
    }

    getTimeLeftQRCode(request: string): Observable<SafeAny> {
        return this.courseService.post(
            CourseWebConstant.PAYMENT_FOR_WEB + `/TimeLeftQRCode?${ObjectUtil.mapObjectToQuery({ request })}`,
            {}
        );
    }
}
