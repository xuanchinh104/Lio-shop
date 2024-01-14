import {
    AfterViewInit,
    Directive,
    DoCheck,
    ElementRef,
    forwardRef,
    HostListener,
    Inject,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    OnInit,
    Optional,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from './currency-mask.config';
import { InputHandler } from './input.handler';
import { SafeAny } from '@asc/shared/utils';

export const CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyMaskDirective),
    multi: true,
};

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[currencyMask]',
    providers: [
        CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR,
        {
            provide: NG_VALIDATORS,
            useExisting: CurrencyMaskDirective,
            multi: true,
        },
    ],
})
export class CurrencyMaskDirective implements AfterViewInit, ControlValueAccessor, DoCheck, OnInit, Validator {
    @Input() max?: number;
    @Input() min?: number;
    @Input() options: SafeAny = {};

    inputHandler?: InputHandler;
    keyValueDiffer: KeyValueDiffer<SafeAny, SafeAny>;

    optionsTemplate = {
        align: 'right',
        allowNegative: true,
        decimal: ',',
        precision: 0,
        prefix: '',
        suffix: '',
        thousands: '.',
    };

    constructor(
        @Optional() @Inject(CURRENCY_MASK_CONFIG) private currencyMaskConfig: CurrencyMaskConfig,
        private elementRef: ElementRef,
        private keyValueDiffers: KeyValueDiffers
    ) {
        if (currencyMaskConfig) {
            this.optionsTemplate = currencyMaskConfig;
        }

        this.keyValueDiffer = keyValueDiffers.find({}).create();
    }

    ngAfterViewInit(): void {
        this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
    }

    ngDoCheck(): void {
        if (this.keyValueDiffer.diff(this.options)) {
            this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
            this.inputHandler?.updateOptions((<SafeAny>Object).assign({}, this.optionsTemplate, this.options));
        }
    }

    ngOnInit(): void {
        this.inputHandler = new InputHandler(
            this.elementRef.nativeElement,
            (<SafeAny>Object).assign({}, this.optionsTemplate, this.options)
        );
    }

    @HostListener('blur', ['$event'])
    handleBlur(event: SafeAny): void {
        this.inputHandler?.getOnModelTouched().apply(event);
    }

    @HostListener('click', ['$event'])
    handleClick(event: SafeAny): void {
        this.inputHandler?.handleClick(event, this.isChromeAndroid());
    }

    @HostListener('cut', ['$event'])
    handleCut(event: SafeAny): void {
        if (!this.isChromeAndroid()) {
            this.inputHandler?.handleCut(event);
        }
    }

    @HostListener('input', ['$event'])
    handleInput(event: SafeAny): void {
        if (this.isChromeAndroid()) {
            this.inputHandler?.handleInput(event);
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeydown(event: SafeAny): void {
        if (!this.isChromeAndroid()) {
            this.inputHandler?.handleKeydown(event);
        }
    }

    @HostListener('keypress', ['$event'])
    handleKeypress(event: SafeAny): void {
        if (!this.isChromeAndroid()) {
            this.inputHandler?.handleKeypress(event);
        }
    }

    @HostListener('keyup', ['$event'])
    handleKeyup(event: SafeAny): void {
        if (!this.isChromeAndroid()) {
            this.inputHandler?.handleKeyup(event);
        }
    }

    @HostListener('paste', ['$event'])
    handlePaste(event: SafeAny): void {
        if (!this.isChromeAndroid()) {
            this.inputHandler?.handlePaste(event);
        }
    }

    isChromeAndroid(): boolean {
        return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    registerOnChange(callbackFunction: Function): void {
        this.inputHandler?.setOnModelChange(callbackFunction);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    registerOnTouched(callbackFunction: Function): void {
        this.inputHandler?.setOnModelTouched(callbackFunction);
    }

    setDisabledState(value: boolean): void {
        this.elementRef.nativeElement.disabled = value;
    }

    validate(abstractControl: AbstractControl): { [key: string]: SafeAny } {
        const result: SafeAny = {};

        if (this.max && abstractControl.value > this.max) {
            result.max = true;
        }

        if (this.min && abstractControl.value < this.min) {
            result.min = true;
        }

        // eslint-disable-next-line eqeqeq
        return result !== {} ? result : null;
    }

    writeValue(value: number): void {
        this.inputHandler?.setValue(value);
        if (value === 0) {
            this.elementRef.nativeElement.value = 0;
        }
    }
}
