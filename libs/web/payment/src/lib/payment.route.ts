import { RouterModule } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';

export const PaymentRoute = RouterModule.forChild([
    {
        path: '',
        component: PaymentListComponent,
    },
    {
        path: 'result',
        component: PaymentResultComponent,
    },
]);
