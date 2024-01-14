import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { HocVien } from '@asc/web/shell/data-access/models';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-notifications',
    templateUrl: './notifications.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
    @Input() infoHocVien!: HocVien;
    @Output() isClose = new EventEmitter<boolean>();
    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    constructor(@Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {}

    closeNoti(): void {
        this.isClose.emit(false);
    }
}
