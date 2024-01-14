import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
    selector: 'asc-control-error',
    templateUrl: './control-error.component.html',
    styleUrls: ['./control-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
    // tslint:disable-next-line:variable-name
    hide = true;

    // tslint:disable-next-line:variable-name
    error?: string;
    @Input() set text(value: string) {
        if (value !== this.error) {
            this.error = value;
            this.hide = !value;
            this.cdr.detectChanges();
        }
    }

    constructor(private cdr: ChangeDetectorRef) {}
}
