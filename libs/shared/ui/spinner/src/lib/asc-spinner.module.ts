import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscSpinnerComponent } from './asc-spinner.component';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';

@NgModule({
    imports: [CommonModule, SafeHtmlPipeModule],
    declarations: [AscSpinnerComponent],
    exports: [AscSpinnerComponent],
})
export class AscSpinnerModule {}
