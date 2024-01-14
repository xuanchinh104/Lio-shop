import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtrlClickDirective } from './ctr-click.directive';

@NgModule({
    declarations: [CtrlClickDirective],
    imports: [CommonModule],
    exports: [CtrlClickDirective],
})
export class CtrClickModule {}
