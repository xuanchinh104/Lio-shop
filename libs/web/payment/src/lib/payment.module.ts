import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoute } from './payment.route';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { CurrencyFormatModule } from '@asc/web/shell/data-access/pipes/currency';
import { AscButtonModule } from '@asc/shared/ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { InitPayQRCodeComponent } from './payment-list/init-pay-qr-code/init-pay-qr-code.component';

@NgModule({
    declarations: [PaymentListComponent, PaymentResultComponent, PaymentTypesComponent, InitPayQRCodeComponent],
    imports: [
        CommonModule,
        PaymentRoute,
        SvgIconsModule,
        NzCheckboxModule,
        NzToolTipModule,
        NzCollapseModule,
        CurrencyFormatModule,
        AscButtonModule,
        FormsModule,
        NzIconModule,
        TranslocoModule,
        ReactiveFormsModule,
        ValidatorRequiredDirectiveModule,
        NzRadioModule,
        FormControlModule,
    ],
})
export class WebPaymentModule {}
