import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Receipt } from '@asc/web/shell/data-access/models';
import { PaymentService } from '@asc/web/shell/data-access/service';
import { map, shareReplay, startWith } from 'rxjs/operators';

@Component({
    selector: 'asc-receipt-list',
    templateUrl: './receipt-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptListComponent {
    receipts$ = this.paymentService.getReceipts().pipe(shareReplay());

    receipt!: Receipt | null;
    readonly isEmpty$ = this.receipts$.pipe(
        map(rs => rs.length <= 0),
        startWith(false)
    );
    constructor(private paymentService: PaymentService) {}

    trackByFunc(index: number): number {
        return index;
    }

    onShowReceiptDetail(receipt: Receipt): void {
        this.receipt = receipt;
    }

    onClose(): void {
        this.receipt = null;
    }
}
