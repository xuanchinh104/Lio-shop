import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserRegister } from '@asc/web/shell/data-access/models';

@Component({
    selector: 'asc-notication',
    templateUrl: './notication.component.html',
    styleUrls: ['./notication.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticationComponent {
    @Output() isClose = new EventEmitter<boolean>();
    @Input() userRegister: UserRegister | null = null;

    closeNoti(): void {
        this.isClose.emit(false);
    }
}
