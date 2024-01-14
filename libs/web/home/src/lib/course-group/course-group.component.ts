import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CourseSubscribeInfoComponent } from '@asc/web/course-list';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-course-group',
    templateUrl: './course-group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseGroupComponent {
    @Output() isOpenModal = new EventEmitter<boolean>();
    isLoading$ = new BehaviorSubject<boolean>(true);
    courses$ = this.courseService.getLopHocByGroup(8, 1).pipe(finalize(() => this.isLoading$.next(false)));

    isDangKyThongTin = false;

    constructor(
        private courseService: CourseWebService,
        private router: Router,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {}

    showListCourse(alias: string): void {
        this.router.navigate(['/course', alias]);
    }

    trackByFunc(index: number): number {
        return index;
    }

    onSubscribeInfo(alias: string): void {
        this.isDangKyThongTin = true;
        this.isOpenModal.emit(true);
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: CourseSubscribeInfoComponent,
            nzComponentParams: {
                alias,
            },
            nzWrapClassName: 'sign-up-info',
            nzWidth: 850,
            nzFooter: null,
            nzMaskClosable: false,
            nzCloseIcon: '',
            nzClosable: false,
        });
        modal.afterClose.pipe().subscribe(() => {
            this.isDangKyThongTin = false;
            this.isOpenModal.emit(false);
            this.cdr.detectChanges();
        });
    }
}
