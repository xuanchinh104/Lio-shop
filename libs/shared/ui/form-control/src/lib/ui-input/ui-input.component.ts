import { ChangeDetectorRef, Component, forwardRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControlComponent } from '../form-control.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-input',
    templateUrl: './ui-input.component.html',
    styleUrls: ['./ui-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => UIInputComponent),
        },
    ],
})
export class UIInputComponent extends FormControlComponent implements OnInit, OnChanges, ControlValueAccessor {
    constructor(protected cdRef: ChangeDetectorRef) {
        super(cdRef);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }
}
