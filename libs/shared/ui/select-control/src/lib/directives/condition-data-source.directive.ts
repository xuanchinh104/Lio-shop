import { SELECT_DIRECTIVE } from './constants';
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Option, SelectDirective } from './types';
import { SelectControlEnum } from '../select-control.enum';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'select-control[appConditionDataSource]',
    providers: [
        {
            provide: SELECT_DIRECTIVE,
            useExisting: ConditionDataSourceDirective,
        },
    ],
})
export class ConditionDataSourceDirective implements OnChanges, SelectDirective {
    @Input() type!: SelectControlEnum;
    @Input() refId!: number;
    options$: Observable<Option[]> = of([]);

    constructor() {
        // code here
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { refId } = changes;
        if (refId?.currentValue) {
            // set value
            this.refId = refId.currentValue;
        }
    }
}
