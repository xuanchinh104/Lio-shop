import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'asc-grid-search',
    templateUrl: './grid-search.component.html',
    styleUrls: ['./grid-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: GridSearchComponent,
        },
    ],
})
export class GridSearchComponent implements OnInit, ControlValueAccessor {
    readonly searchControl = new FormControl('');
    // @Output() search = new EventEmitter();
    touched = false;

    ngOnInit(): void {
        this.searchControl.valueChanges.subscribe(() => {
            const value = this._getValue();
            this.onChange(value);
        });
    }

    onChange = (keyword: string): void => {
        // console.warn(keyword);
    };

    onTouched = (): void => {
        // code here
    };

    onSearchChange(): void {
        const value  = this.searchControl.value;
        if (value) {
            this.onChange(this.searchControl.value);
        } else {
            this.onChange('');
        }
        // this.search.emit();
    }

    registerOnChange(fn: any): void {
        // code here
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        // code here
        this.onTouched = fn;
    }

    writeValue(keyword: string): void {
        this.searchControl.setValue(keyword);
    }

    private _getValue(): string {
        try {
            if (this.searchControl.invalid) {
                return '';
            }

            return this.searchControl.value;
        } catch {
            // Return null if something throws
            return '';
        }
    }
}
