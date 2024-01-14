import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { LopHocRegistered } from '@asc/web/shell/data-access/models';
import { finalize, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { ModalDeleteConfig } from '@asc/core/constants';
import { TranslocoService } from '@ngneat/transloco';
import { NotificationService } from '@asc/shared/services/common';
import { SafeAny } from '@asc/shared/utils';

export enum CourseRegisteredLayout {
    CourseRegistredList,
    CourseAttachment,
    CourseAttachmentDetail,
}

interface MapData {
    id: number;
    children: LopHocRegistered[];
    isHuyLop: boolean;
}

@Component({
    selector: 'asc-course-registered',
    templateUrl: './course-registered.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseRegisteredComponent {
    @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent<LopHocRegistered>;

    readonly refresh$ = new BehaviorSubject(false);
    readonly trigger$ = combineLatest([this.refresh$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(() => this.courseService.getMyCourse()),
        shareReplay()
    );
    readonly courseRegistereds$ = this.request$.pipe(
        tap(res => this.mapData(res)),
        shareReplay()
    );

    readonly isEmpty$ = this.request$.pipe(
        map(rs => rs.length <= 0),
        startWith(false)
    );

    itemSelecteds: MapData[] = [];

    layout = CourseRegisteredLayout.CourseRegistredList;
    courseLayout = CourseRegisteredLayout;

    courseSelected: LopHocRegistered | null = null;
    modalConfirmRef?: NzModalRef;

    private destroyed$ = new Subject();

    constructor(
        private courseService: CourseWebService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService,
        private notificationService: NotificationService
    ) {}

    trackByFunc(index: number): number {
        return index;
    }

    onHuyDangKy(item: MapData): void {
        const lopHoc = item.children;
        let isModalLoading = false;
        this.modalConfirmRef = this.modal.confirm({
            nzTitle: this.translocoService.translate('TEXT_NOTI'),
            nzClassName: 'custom-confirm-modal',
            nzContent: this.translocoService.translate('TEXT_CONFIRM2'),
            nzOkText: this.translocoService.translate('TEXT_OK1'),
            nzOkDanger: true,
            nzOnOk: () =>
                new Promise(() => {
                    isModalLoading = true;
                    this.courseService
                        .post(CourseWebConstant.HOC_VIEN_FOR_WEB + '/CancelRegister', {
                            ids: lopHoc.map(x => x.id),
                        })
                        .pipe(
                            finalize(() => {
                                isModalLoading = false;
                                this.modalConfirmRef?.updateConfig({
                                    nzOkLoading: isModalLoading,
                                });
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(
                            () => {
                                this.modalConfirmRef?.close();
                                this.notificationService.showSuccessMessage(this.translocoService.translate('TEXT_SUCCESS3'));
                                this.removeHandle(item.id);
                                this.refresh$.next(true);
                            },
                            error => {
                                this.modalConfirmRef?.close();
                            }
                        );
                }),
            nzCancelText: this.translocoService.translate('TEXT_CANCEL_MODAL'),
        });
    }

    uploadCourseAttachment(course: LopHocRegistered): void {
        this.layout = CourseRegisteredLayout.CourseAttachmentDetail;
        this.courseSelected = course;
    }

    onClose(): void {
        this.layout = CourseRegisteredLayout.CourseRegistredList;
        this.courseSelected = null;
    }

    private mapData(data: LopHocRegistered[]): MapData[] {
        const groupedArray: { [id: number]: SafeAny[] } = {};
        data.forEach(item => {
            if (item.idLoaiMienGiam === 2) {
                const itemId = item.idMienGiam ? item.idMienGiam : item.id;
                if (groupedArray[itemId]) {
                    groupedArray[itemId].push(item);
                } else {
                    groupedArray[itemId] = [item];
                }
            } else {
                this.itemSelecteds.push({
                    id: item.id,
                    children: [item],
                    isHuyLop: item.isHuyLop,
                });
            }
        });
        // eslint-disable-next-line guard-for-in
        for (const itemId in groupedArray) {
            const group = groupedArray[itemId];
            const isHuyLop = group[0]?.isHuyLop;
            group.forEach(x => {
                if (!x.isMienGiam && !x.isHuyLop) {
                    x.isThanhToan = true;
                }
            });
            const resultItem = {
                id: Number(itemId),
                children: group as LopHocRegistered[],
                isHuyLop,
            } as MapData;
            this.itemSelecteds.push(resultItem);
        }
        const key = 'id';
        const arr = [...new Map(this.itemSelecteds.map(item => [item[key], item])).values()];
        this.itemSelecteds = [...arr];
        this.itemSelecteds.sort((a, b) => {
            if (a.isHuyLop && !b.isHuyLop) {
                return -1;
            } else if (!a.isHuyLop && b.isHuyLop) {
                return 1;
            } else {
                return 0;
            }
        });

        return this.itemSelecteds;
    }

    private removeHandle(id: number): void {
        const idx = this.itemSelecteds.findIndex(course => course.id === id);
        if (idx > -1) {
            this.itemSelecteds.splice(idx, 1);
        }
    }
}
