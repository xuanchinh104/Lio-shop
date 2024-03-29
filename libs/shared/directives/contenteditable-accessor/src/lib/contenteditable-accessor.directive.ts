import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[contenteditable][formControlName], [contenteditable][formControl], [contenteditable][ngModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContenteditableValueAccessorDirective),
            multi: true,
        },
    ],
})
export class ContenteditableValueAccessorDirective implements ControlValueAccessor, AfterViewInit, OnDestroy {
    constructor(@Inject(ElementRef) private readonly elementRef: ElementRef, @Inject(Renderer2) private readonly renderer: Renderer2) {}

    /*
     * null is treated as empty string to prevent IE11 outputting 'null',
     * also single <br> is replaced with empty string when passed to the control
     */
    private static processValue(value: unknown): string {
        const processed = String(value == null ? '' : value);

        return processed.trim() === '<br>' ? '' : processed;
    }

    /*
     * To support IE11 MutationObserver is used to monitor changes to the content
     */
    ngAfterViewInit(): void {
        this.observer.observe(this.elementRef.nativeElement, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    }

    /*
     * Disconnect MutationObserver IE11 fallback on destroy
     */
    ngOnDestroy(): void {
        this.observer.disconnect();
    }

    /*
     * Listen to input events to write innerHTML value into control,
     * also disconnect MutationObserver as it is not needed if this
     * event works in current browser
     */
    @HostListener('input') onInput(): void {
        this.observer.disconnect();
        this.onChange(ContenteditableValueAccessorDirective.processValue(this.elementRef.nativeElement.innerHTML));
    }

    /*
     * Listen to blur event to mark control as touched
     */
    @HostListener('blur') onBlur(): void {
        this.onTouched();
    }

    /*
     * Reacts to external change
     *
     * @see {@link ControlValueAccessor#writeValue}
     */
    writeValue(value: string | null): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', ContenteditableValueAccessorDirective.processValue(value));
    }

    /*
     * Registers onChange callback
     *
     * @see {@link ControlValueAccessor#registerOnChange}
     */
    registerOnChange(onChange: (value: string) => void): void {
        this.onChange = onChange;
    }

    /*
     * Registers onTouch callback
     *
     * @see {@link ControlValueAccessor#registerOnTouched}
     */
    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    /*
     * Sets disabled state by setting contenteditable attribute to true/false
     *
     * @see {@link ControlValueAccessor#setDisabledState}
     */
    setDisabledState(disabled: boolean): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'contenteditable', String(!disabled));
    }

    /*
     * onTouch callback that marks control as touched and allows FormHooks use
     */
    private onTouched = (): void => {
        // code here
    };

    /*
     * onChange callback that writes value to control and allows FormHooks use
     */
    private onChange: (value: string) => void = () => {
        // code here
    };

    /*
     * MutationObserver IE11 fallback (as opposed to input event for modern browsers).
     * When mutation removes a tag, i.e. delete is pressed on the last remaining character
     * inside a tag — callback is triggered before the DOM is actually changed, therefore
     * setTimeout is used
     */
    private observer = new MutationObserver(() => {
        setTimeout(() => {
            this.onChange(ContenteditableValueAccessorDirective.processValue(this.elementRef.nativeElement.innerHTML));
        });
    });
}
