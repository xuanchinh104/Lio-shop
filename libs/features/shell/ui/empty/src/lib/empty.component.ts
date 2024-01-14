import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'asc-empty',
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent {
    @Input() keyTranslate = 'BTN.ADD';

    @Input() title = 'LB.NONE';

    @Input() desc = '';

    @Input() isHasAction = true;

    @Output() action = new EventEmitter();

    handleEmpty(): void {
        this.action.emit();
    }
}
