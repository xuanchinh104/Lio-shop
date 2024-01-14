import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscButtonComponent } from './asc-button.component';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UIButtonComponent } from './ui-button/ui-button.component';

@NgModule({
    imports: [CommonModule, SafeHtmlPipeModule, NzIconModule],
    declarations: [AscButtonComponent, UIButtonComponent],
    exports: [AscButtonComponent, UIButtonComponent],
})
export class AscButtonModule {}
