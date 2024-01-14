import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRouting } from './overview.route';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { OverviewComponent } from './overview.component';
import { ChartModule } from '@progress/kendo-angular-charts';
import { OverflowBodyModule } from '@asc/shared/directives/overflow-body';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectControlModule } from '@asc/shared/ui/select-control';
import { TranslocoModule } from '@ngneat/transloco';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { AscButtonModule } from '@asc/shared/ui/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';

import 'hammerjs';

@NgModule({
    imports     : [
        CommonModule,
        OverviewRouting,
        ChartModule,
        OverflowBodyModule,
        ReactiveFormsModule,
        SelectControlModule,
        TranslocoModule,
        FormControlModule,
        AscButtonModule,
        WrapFormModule,

        NzPopoverModule,
        NzDropDownModule,
        NzNoAnimationModule
    ],
    declarations: [
        OverviewComponent,
    ]
})
export class OverviewModule {
}
