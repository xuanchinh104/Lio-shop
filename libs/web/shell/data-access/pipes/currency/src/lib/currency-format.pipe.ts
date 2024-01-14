import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
    transform(value: number): string {
        if (value > 0) {
            return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
        } else {
            return '0';
        }
    }
}
