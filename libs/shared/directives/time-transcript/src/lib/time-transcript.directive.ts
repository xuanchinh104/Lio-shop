import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { SafeAny } from '@asc/shared/utils';

const PADDING = '000000';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[timeTranscript]',
})
export class TimeTranscriptDirective implements OnInit {
    private el: HTMLInputElement;
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor(private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = "'";
    }

    ngOnInit(): void {
        this.el.value = this.transform(this.el.value);
    }

    @HostListener('focus', ['$event.target.value'])
    onFocus(value: SafeAny): void {
        this.el.value = this.parse(value); // opossite of transform
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value: SafeAny): void {
        this.el.value = this.transform(value);
    }

    transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').toString().split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0 ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : '';
        // check fraction > 59s
        if (parseFloat(fraction) > 0.59) {
            fraction = '.59';
        }

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(' ', 'g'), '');

        fraction =
            parseInt(fraction, 10) > 0 && fractionSize > 0 ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : '';
        // check fraction > 59s
        if (parseFloat(fraction) > 0.59) {
            fraction = '.59';
        }

        return integer + fraction;
    }
}
