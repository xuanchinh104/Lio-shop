import { Directive } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[required]',
})
export class ControlRequiredDirective {
    constructor(private controlDir: NgControl) {}

    get control(): AbstractControl | null {
        return this.controlDir.control;
    }
}
