import {
    AfterViewInit,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    Host,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { FORM_ERRORS } from './form-errors';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { FormSubmitDirective } from './form-submit.directive';
import { ControlErrorComponent } from './control-error/control-error.component';
import { takeUntil } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[formControl], [formControlName]',
})
export class ControlErrorsDirective implements OnInit, AfterViewInit, OnDestroy {
    ref?: ComponentRef<ControlErrorComponent>;
    container: ViewContainerRef;
    submit$: Observable<Event>;
    @Input() customErrors = {} as SafeAny;

    private destroyed$ = new Subject();

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private vcr: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        @Optional() controlErrorContainer: ControlErrorContainerDirective,
        @Inject(FORM_ERRORS) private errors: SafeAny,
        @Optional() @Host() private form: FormSubmitDirective,
        private controlDir: NgControl
    ) {
        this.container = controlErrorContainer ? controlErrorContainer.vcr : vcr;
        this.submit$ = this.form ? this.form.submit$ : EMPTY;
    }

    ngOnInit(): void {
        if (this.control?.valueChanges) {
            merge(this.submit$, this.control.valueChanges)
                .pipe(takeUntil(this.destroyed$))
                .subscribe(() => {
                    this.handleError();
                });

            this.control?.valueChanges.subscribe(() => {
                this.handleError();
            });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngAfterViewInit(): void {
        this.setRequired();
    }

    private setRequired(): void {
        if (this.validator) {
            const parent = this.el.nativeElement.closest('.form-group');
            if (
                parent?.getElementsByTagName('LABEL') &&
                parent.getElementsByTagName('LABEL').length &&
                !parent.getElementsByClassName('required-asterisk').length
            ) {
                setTimeout(() => {
                    parent.getElementsByTagName('LABEL')[0].innerHTML += '<sup class="required-asterisk text-danger"> (*)</sup>';
                }, 0);
            } else {
                const children = this.el.nativeElement.querySelector('.form-group');
                if (
                    children?.getElementsByTagName('LABEL') &&
                    children.getElementsByTagName('LABEL').length &&
                    !children.getElementsByClassName('required-asterisk').length
                ) {
                    setTimeout(() => {
                        children.getElementsByTagName('LABEL')[0].innerHTML += '<sup class="required-asterisk text-danger"> (*)</sup>';
                    }, 0);
                }
            }
        }
    }

    get control(): AbstractControl | null {
        return this.controlDir.control;
    }

    get validator(): boolean {
        if (!this.control) {
            return false;
        }

        if (this.control.validator) {
            const validators = this.control.validator({} as AbstractControl);
            if (validators?.required) {
                return true;
            }
        }

        return false;
    }

    setError(text: string): void {
        const factory = this.resolver.resolveComponentFactory(ControlErrorComponent);
        if (!this.ref) {
            const element = this.container.element.nativeElement.querySelector('.control-validator');
            if (element) {
                this.ref = factory.create(this.vcr.injector, undefined, element);
            } else {
                this.ref = this.container.createComponent(factory);
            }
        }

        this.ref.instance.text = text;
    }

    setStyleInvalid(): void {
        const elmControl = this.container.element.nativeElement.querySelector('.form-control');
        const elmInput = this.container.element.nativeElement;
        const iconInputNumber = this.container.element.nativeElement.querySelector('.ant-input-number-handler-wrap');
        const elmSelect = this.container.element.nativeElement.querySelector('.ant-select-selector');
        const iconSelectArrow = this.container.element.nativeElement.querySelector('.ant-select-arrow');
        const iconSelectSearch = this.container.element.nativeElement.querySelector('.ant-select-selection-search');
        const ckeditorContent = this.container.element.nativeElement.querySelector('.ck-editor__editable');

        if (elmControl) {
            elmControl.style.border = 'solid 1px #ff0e0e';
            elmControl.style.paddingRight = '39px';
        }
        if (elmInput && !elmSelect && !elmControl && !ckeditorContent) {
            elmInput.style.border = 'solid 1px #ff0e0e';
            elmInput.style.paddingRight = '39px';
        }
        if (iconInputNumber) {
            iconInputNumber.style.right = '30px';
        }
        if (elmSelect) {
            elmSelect.style.border = 'solid 1px #ff0e0e';
            elmSelect.style.paddingRight = '39px';
        }
        if (iconSelectArrow) {
            iconSelectArrow.style.paddingRight = '39px';
        }
        if (iconSelectSearch) {
            iconSelectSearch.style.right = '52px';
        }
        if (ckeditorContent) {
            ckeditorContent.style.border = 'solid 1px #ff0e0e';
            ckeditorContent.style.paddingRight = '39px';
            ckeditorContent.style.position = 'relative';
        }
    }

    setStyleDefault(): void {
        const elmControl = this.container.element.nativeElement.querySelector('.form-control');
        const elmInput = this.container.element.nativeElement;
        const iconInputNumber = this.container.element.nativeElement.querySelector('.ant-input-number-handler-wrap');
        const elmSelect = this.container.element.nativeElement.querySelector('.ant-select-selector');
        const iconSelectArrow = this.container.element.nativeElement.querySelector('.ant-select-arrow');
        const iconSelectSearch = this.container.element.nativeElement.querySelector('.ant-select-selection-search');
        const ckeditorContent = this.container.element.nativeElement.querySelector('.ck-editor__editable');

        if (elmControl) {
            elmControl.style.border = '1px solid #ced4da';
            elmControl.style.paddingRight = '11px';
        }
        if (elmInput && !elmSelect && !elmControl && !ckeditorContent) {
            elmInput.style.border = '1px solid #ced4da';
            elmInput.style.paddingRight = '11px';
        }
        if (iconInputNumber) {
            iconInputNumber.style.right = '0px';
        }
        if (elmSelect) {
            elmSelect.style.border = 'solid 1px #ced4da';
        }
        if (iconSelectArrow) {
            iconSelectArrow.style.paddingRight = '11px';
        }
        if (iconSelectSearch) {
            iconSelectSearch.style.right = '25px';
        }
        if (ckeditorContent) {
            ckeditorContent.style.right = '25px';
        }
    }

    private handleError(): void {
        const controlErrors = this.control?.errors;
        if (controlErrors) {
            const firstKey = Object.keys(controlErrors)[0];
            const getError = this.errors[firstKey];
            if (firstKey) {
                const text = this.customErrors[firstKey] || getError(controlErrors[firstKey]);
                this.setError(text);
                this.setStyleInvalid();
                this.setRequired();
            }
        } else if (this.ref) {
            this.setError('');
            this.setStyleDefault();
            this.setRequired();
        }
    }
}
