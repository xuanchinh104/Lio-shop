import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './currency-format.pipe';

@NgModule({
    imports: [CommonModule],
    exports: [CurrencyFormatPipe],
    declarations: [CurrencyFormatPipe],
})
export class CurrencyFormatModule {}
