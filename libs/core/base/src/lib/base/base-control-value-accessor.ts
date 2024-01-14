import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective } from '@angular/forms';
import { Directive, Input, ViewChild } from '@angular/core';

@Directive() // Prevent error with Angular 9 and upper
// tslint:disable-next-line:directive-class-suffix
export class BaseControlValueAccessor implements ControlValueAccessor {
    @ViewChild(FormControlDirective, { static: true })
    formControlDirective?: FormControlDirective;
    @Input() formControl?: FormControl;
    @Input() formControlName?: string;

    get control(): FormControl {
        return this.formControl || (this.controlContainer.control?.get(this.formControlName as string) as FormControl);
    }

    protected constructor(protected controlContainer: ControlContainer) {}

    registerOnChange(fn: any): void {
        // code here
    }

    registerOnTouched(fn: any): void {
        // code here
    }

    setDisabledState(isDisabled: boolean): void {
        // code here
    }

    writeValue(obj: any): void {
        // code here
    }
}
