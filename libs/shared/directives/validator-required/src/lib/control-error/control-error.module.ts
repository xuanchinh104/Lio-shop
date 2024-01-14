import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorComponent } from './control-error.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
    declarations: [ControlErrorComponent],
    entryComponents: [ControlErrorComponent],
    imports: [CommonModule, SvgIconsModule, NzToolTipModule],
    exports: [ControlErrorComponent],
})
export class ControlErrorModule {}
