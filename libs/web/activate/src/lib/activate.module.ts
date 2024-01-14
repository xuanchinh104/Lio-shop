import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateComponent } from './activate.component';
import { RouterModule } from '@angular/router';
import { AscButtonModule } from '@asc/shared/ui/button';
import { IconModule } from '@asc/shared/ui/icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'Activate/:key',
                component: ActivateComponent,
            },
        ]),
        AscButtonModule,
        IconModule,
        NzIconModule,
        TranslocoModule,
    ],
    declarations: [ActivateComponent],
})
export class ActivateModule {}
