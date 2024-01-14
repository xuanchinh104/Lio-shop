import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AscButtonComponent } from '../asc-button.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ui-button',
    templateUrl: './ui-button.component.html',
    styleUrls: ['./ui-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIButtonComponent extends AscButtonComponent implements OnDestroy {
    constructor(protected cdr: ChangeDetectorRef) {
        super(cdr);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
