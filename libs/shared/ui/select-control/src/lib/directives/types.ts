import { Observable } from 'rxjs';

export interface Option {
    value: number;
    label: string;
}

export interface SelectDirective {
    options$: Observable<Option[]>;
}
