import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {
    @Input() title = '';
    @Input() value = '';
    @Input() isDeleteAll = false;

    constructor(private ref: NzModalRef) {}

    close(): void {
        this.ref.close(false);
    }

    onSubmit(): void {
        this.ref.close(true);
    }
}
