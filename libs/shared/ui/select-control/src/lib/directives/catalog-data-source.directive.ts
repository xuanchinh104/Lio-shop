import { SELECT_DIRECTIVE } from './constants';
import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Option, SelectDirective } from './types';
import { SelectControlEnum } from '../select-control.enum';
import { QueryOption } from '@asc/shared/data-access';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'select-control[appCatalogDataSource]',
    providers: [
        {
            provide: SELECT_DIRECTIVE,
            useExisting: CatalogDataSourceDirective,
        },
    ],
})
export class CatalogDataSourceDirective implements OnInit, OnChanges, SelectDirective {
    @Input() type!: SelectControlEnum;
    @Input() refId!: number;

    @Output() selectedItem = new EventEmitter<Option>();
    options$: Observable<Option[]> = of([]);

    constructor() {
        // code here
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { refId } = changes;
        if (refId?.currentValue) {
            // set value
            this.refId = refId.currentValue;
            this.init();
        }
    }

    ngOnInit(): void {
        this.init();
    }

    init(): void {
        // code here
    }

    get queryOption(): QueryOption {
        return {
            pageNumber: 0,
            pageSize: 0,
            isVisible: true,
        };
    }
}
