import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'notfound-tpl',
    templateUrl: './notfound-tpl.component.html',
    styleUrls: ['./notfound-tpl.component.scss'],
})
export class NotfoundTplComponent implements OnChanges {
    @Input() isLoading = false;
    @Input() length = 0;

    ngOnChanges(changes: SimpleChanges): void {
        const { isLoading } = changes;
        if (isLoading?.currentValue) {
            this.isLoading = isLoading.currentValue;
        }
    }
}
