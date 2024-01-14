import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
    selector: 'asc-payment-result',
    templateUrl: './payment-result.component.html',
    styleUrls: ['./payment-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentResultComponent {
    // vnp_TxnRef
    params$ = this.route.queryParams.pipe(
        map(param => {
            if (param['Trans_Id']) {
                return param['Trans_Id'];
            } else if (param['mrc_order_id']) {
                return param['mrc_order_id'];
            } else {
                return param['vnp_TxnRef'];
            }
        })
    );

    refreshPayment$ = new BehaviorSubject<boolean | null>(false);

    trigger$ = combineLatest([this.params$, this.refreshPayment$]).pipe(shareReplay());

    resultPay$ = this.trigger$.pipe(
        map(([transId]) => transId),
        switchMap(transId => this.paymentService.getResultPay(transId)),
        shareReplay()
    );

    isPaymentStatus$ = this.resultPay$.pipe(
        tap(rs => {
            if (rs.code === '01') {
                setTimeout(() => {
                    this.refreshPayment$.next(true);
                }, 5000);
            }
        })
    );

    constructor(private paymentService: PaymentService, private route: ActivatedRoute) {}
}
