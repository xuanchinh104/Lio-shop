import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentService } from '@asc/web/shell/data-access/service';
import { Bank } from '@asc/web/shell/data-access/models';
import { PaymentTypeDescription, PaymentTypeEnum, PaymentTypeImage } from '@asc/web/shell/data-access/constant';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum BankEnum {
    BAO_KIM = 995,
    VNPAY = 999,
    BIDV = 10,
}

@Component({
    selector: 'asc-payment-types',
    templateUrl: './payment-types.component.html',
    styleUrls: ['./payment-types.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTypesComponent {
    idTaiKhoanThanhToan$ = new BehaviorSubject<number>(0);
    @Input() set idTaiKhoanThanhToan(val: number) {
        if (val) {
            this.idTaiKhoanThanhToan$.next(val);
        }
    }

    bankEnum = BankEnum;

    request$ = combineLatest([this.idTaiKhoanThanhToan$]);
    readonly paymentTypes$ = this.request$.pipe(
        switchMap(([idTaiKhoanThanhToan]) => this.paymnetService.getPaymentTypes(idTaiKhoanThanhToan))
    );

    paymentTypeEnum = PaymentTypeEnum;
    paymentTypeDescription = PaymentTypeDescription;
    paymentTypeImage = PaymentTypeImage;

    selectedBank!: Bank;

    @Output() selectBank = new EventEmitter<Bank | null>();
    constructor(private paymnetService: PaymentService) {}

    onSelectBank(bank: Bank): void {
        this.selectedBank = bank;

        this.selectBank.emit(bank);
    }

    trackByFunc(index: number): number {
        return index;
    }
}
