import { Component, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { BaseControlValueAccessor } from '@asc/core/base';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Option, SelectDirective } from './directives/types';
import { SELECT_DIRECTIVE } from './directives/constants';

export type SelectSize = 'large' | 'default' | 'small';
export type Mode = 'multiple' | 'tags' | 'default';

@Component({
    selector: 'select-control',
    templateUrl: './select-control.component.html',
    styleUrls: ['./select-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SelectControlComponent,
            multi: true,
        },
    ],
})
export class SelectControlComponent extends BaseControlValueAccessor implements OnInit, OnChanges {
    @Input() placeholder = 'Chọn';
    @Input() size: SelectSize = 'default';
    @Input() mode: Mode = 'default';
    @Input() maxTagCount!: number;
    @Input() allowClear = true;
    @Input() refId!: number;
    options$: Observable<Option[]> = of([]);

    constructor(@Optional() controlContainer: ControlContainer, @Optional() @Inject(SELECT_DIRECTIVE) private directive: SelectDirective) {
        super(controlContainer);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { refId } = changes;
        if (refId?.currentValue) {
            // set value
            this.refId = refId.currentValue;
            this.options$ = this.directive ? this.directive.options$ : of([]);
        }
    }

    ngOnInit(): void {
        this.options$ = this.directive ? this.directive.options$ : of([]);
    }
}
