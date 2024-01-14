import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Ckeditor5Config, OnChangeType, OnTouchedType, SafeAny } from '@asc/shared/utils';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
export type FormControlType = 'input' | 'number' | 'textarea' | 'date' | 'checkbox' | 'password' | 'ckeditor' | 'currency';
export type FormControlMode = 'vertical' | 'horizontal';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'asc-form-control',
    templateUrl: './form-control.component.html',
    styleUrls: ['./form-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FormControlComponent),
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlComponent implements OnInit, OnChanges, ControlValueAccessor {
    inputValue?: string | number | boolean;

    @Input() label?: string;
    @Input() note?: string;
    @Input() val?: string | number | boolean;
    @Input() placeHolder = '';
    @Input() type: FormControlType = 'input';
    @Input() mode: FormControlMode = 'vertical';
    @Input() @InputBoolean() isDisabled = false;
    @Input() step = 1;
    @Input() max!: number;
    @Input() min = 0;
    @Input() rows = 3;
    @Input() disabledDate!: SafeAny;

    leftCol!: string;
    rightCol!: string;

    editor = DecoupledEditor;
    configCkeditor = Ckeditor5Config;

    @Input() set col(value: string) {
        if (value) {
            const array = value.split('-');
            if (array.length === 2) {
                this.leftCol = array[0];
                this.rightCol = array[1];
            }
        }
    }

    constructor(protected cdRef: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        const { value, disabledDate } = changes;
        if (value?.currentValue) {
            this.setValue(value.currentValue);
        }

        if (disabledDate?.currentValue) {
            this.cdRef.detectChanges();
        }
    }

    ngOnInit(): void {
        this.setValue(this.val);
    }

    onChange: OnChangeType = () => {
        // code here
    };
    onTouched: OnTouchedType = () => {
        // code here
    };

    registerOnChange(fn: OnChangeType): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: OnTouchedType): void {
        this.onTouched = fn;
    }

    writeValue(value: string | number | boolean): void {
        this.inputValue = value;
        this.setValue(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDisabledState(disabled: boolean): void {
        this.cdRef.markForCheck();
    }

    onInputChange($event: SafeAny): void {
        const value = $event.target.value;
        if (value) {
            this.setValue($event.target.value);
        } else {
            this.onChange(value);
        }
    }

    onModelChange(value: string | number | boolean | undefined): void {
        if (value) {
            this.setValue(value);
        } else {
            this.onChange(value);
        }
    }

    onReady(editor: SafeAny): void {
        editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

        // editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => new CkeditorUploadAdapter(loader);
    }

    private setValue(value: string | number | boolean | undefined): void {
        this.inputValue = value;
        this.cdRef.detectChanges();
        if (value) {
            this.onChange(value);
        }
    }
}
