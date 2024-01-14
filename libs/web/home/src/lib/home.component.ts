import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CourseSubscribeInfoComponent } from '@asc/web/course-list';

@Component({
    selector: 'asc-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    isDangKyThongTin = false;
    constructor(private modal: NzModalService, private cdr: ChangeDetectorRef) {}

    onSubscribeInfo(): void {
        this.isDangKyThongTin = true;
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: CourseSubscribeInfoComponent,
            nzWrapClassName: 'sign-up-info',
            nzWidth: 850,
            nzFooter: null,
            nzMaskClosable: false,
            nzCloseIcon: '',
            nzClosable: false,
        });
        modal.afterClose.pipe().subscribe(() => {
            this.isDangKyThongTin = false;
            this.cdr.detectChanges();
        });
    }

    openModal(isOpenModal: boolean): void {
        this.isDangKyThongTin = isOpenModal;
    }
}
