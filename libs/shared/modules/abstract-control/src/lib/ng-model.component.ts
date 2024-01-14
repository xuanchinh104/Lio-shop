import { ControlValueAccessor } from '@angular/forms';
import { ChangeDetectorRef, Component, Injector, Input, Type } from '@angular/core';
import { SafeAny } from '@asc/shared/utils';

@Component({ template: '' })
export class AbstractNgModelComponent<T = SafeAny> implements ControlValueAccessor {
    // @Input()
    // cid: string = uuid();

    @Input()
    disabled?: boolean;

    @Input()
    set value(value: T) {
        this._value = value;
        this.notifyValueChange();
    }

    get value(): T {
        return this._value as T;
    }

    onChange?: (value: T) => {
        // code here
    };
    onTouched?: () => {
        // code here
    };

    protected _value?: T;
    protected cdRef: ChangeDetectorRef;

    constructor(public injector: Injector) {
        this.cdRef = injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
    }

    notifyValueChange(): void {
        if (this.onChange) {
            this.onChange(this.value);
        }
    }

    writeValue(value: T): void {
        this._value = value;
        setTimeout(() => this.cdRef.detectChanges(), 0);
    }

    registerOnChange(fn: SafeAny): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: SafeAny): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
