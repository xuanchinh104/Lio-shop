import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { CourseAttachmentRequest, LopHocAttachment, LopHocRegistered, LopHocRegisteredDetail } from '@asc/web/shell/data-access/models';
import { BehaviorSubject, Subject } from 'rxjs';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from '@asc/shared/services/common';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { FileUploadTypeDescription } from '@asc/features/catalog/data-access';
import { ViewFileComponent } from '@asc/shared/ui/view-file';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageConstant } from '@asc/core/constants';
import { TrangThaiHoSoColor, TrangThaiHoSoEnum } from '@asc/web/shell/data-access/constant';
import { TranslocoService } from '@ngneat/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { HinhThucNhanBangComponent } from './hinh-thuc-nhan-bang/hinh-thuc-nhan-bang.component';
import { ActionEnum } from '@asc/shared/data-access';
import { DateUtil } from '@asc/shared/utils';

@Component({
    selector: 'asc-course-attachment-detail',
    templateUrl: './course-attachment-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseAttachmentDetailComponent implements OnInit, OnDestroy {
    courseId$ = new BehaviorSubject<number | null>(null);
    _course: LopHocRegistered | null = null;
    @Input() set course(value: LopHocRegistered | null) {
        if (value) {
            this._course = value;
            this.courseId$.next(value.id);
        }
    }

    @Output() closeForm = new EventEmitter<boolean>();

    courseAttachments: LopHocRegisteredDetail[] = [];
    trangThaiHoSoColor = TrangThaiHoSoColor;
    trangThaiHoSoEnum = TrangThaiHoSoEnum;

    readonly course$ = this.courseId$.pipe(
        switchMap(id => this.courseService.getCourseRegistedDetail(id ?? 0)),
        tap(res => {
            if (res.thoiGianKetThucNopHoSo) {
                this.isHanNopHoSo = new Date(res.thoiGianKetThucNopHoSo) <= new Date(DateUtil.getFullDateTime(new Date()) ?? '');
            }
        }),
        shareReplay()
    );
    readonly courseAttachments$ = this.course$.pipe(
        map(rs => (rs ? rs.hoSoLopHocs : [])),
        map(rs =>
            rs.map(item => ({
                ...item,
                type: item.loaiFiles ? item.loaiFiles.map(s => FileUploadTypeDescription[s]).join(', ') : '',
            }))
        ),
        shareReplay()
    );

    readonly isSumitAttachment$ = this.courseAttachments$.pipe(map(rs => rs.filter(m => m.isUpload).length > 0));

    isSubmited = false;
    isPrint = false;

    action!: ActionEnum;

    isHanNopHoSo = false;

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment,
        private modal: NzModalService,
        private courseService: CourseWebService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.courseAttachments$.pipe(takeUntil(this.destroyed$)).subscribe(rs => {
            this.courseAttachments = rs;
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onSubmit(): void {
        if (!this.isHanNopHoSo) {
            const body: CourseAttachmentRequest = {
                idHocVienDangKyKhoaHoc: this._course?.id ?? 0,
                idKhoaHoc: this._course?.idLopHoc ?? 0,
                hoSoKhoaHocs: this.courseAttachments
                    .filter(rs => rs.isUpload)
                    .map(rs => ({
                        idLoaiHoSo: rs.idLoaiHoSo,
                        fileAttachs: rs.fileAttachs.map(file => ({
                            ...file,
                            id: file?.id ?? 0,
                            isDeleted: file.isDeleted ?? false,
                        })),
                    })),
            };

            this.isSubmited = true;
            this.courseService
                .submitCourseAttachment(body)
                .pipe(
                    finalize(() => {
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.courseId$.next(<number>this._course?.id);
                    this.notification.showSuccessMessage(this.translocoService.translate('TEXT_SUCCESS2'));
                });
        } else {
            this.notification.showWarningMessage('Hết hạn nộp hồ sơ !');
        }
    }

    onViewFile(file: LopHocAttachment): void {
        this.modal.create({
            nzTitle: '',
            nzContent: ViewFileComponent,
            nzComponentParams: {
                filePath: file.filePath,
                fileName: file.fileName,
            },
            nzWrapClassName: 'modal-fullscreen view-file',
            nzFooter: null,
            nzClosable: false,
            nzCloseIcon: '',
        });
    }

    download(link: string, fileName: string, fileType: string): void {
        if (fileType === '.png' || fileType === '.jpg' || fileType === '.jpeg' || fileType === '.svg') {
            fetch(this.env.mediaServer + '/' + link)
                .then(resp => resp.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const image = document.createElement('a');
                    image.style.display = 'none';
                    image.href = url;

                    // file name
                    image.download = fileName;
                    document.body.appendChild(image);
                    image.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(() => this.notification.showErrorMessage(MessageConstant.COMMON.MSG_DOWNLOAD_IMAGE_ERROR));
        } else {
            window.open(this.env.mediaServer + '/' + link, '_blank');
        }
    }

    handleMissingImage(event: Event): void {
        (event.target as HTMLImageElement).src = '../assets/images/img/image-default.jpg';
    }

    inPhieuDangKy(): void {
        this.spinner.show();
        this.isPrint = true;
        this.cdr.detectChanges();
        this.courseService
            .onExportData('Reports/InPhieuDangKy', {
                idDangKyKhoaHoc: this._course?.id,
            })
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.isPrint = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    onDKNhanBang(courseDetail: LopHocRegistered): void {
        const modal = this.modal.create({
            nzContent: HinhThucNhanBangComponent,
            nzComponentParams: {
                formState: {
                    action: courseDetail.hinhThucNhan ? ActionEnum.UPDATE : ActionEnum.CREATE,
                    data: courseDetail,
                },
            },
            nzWrapClassName: 'sign-up-info',
            nzWidth: 850,
            nzFooter: null,
            nzMaskClosable: false,
            nzCloseIcon: '',
            nzClosable: false,
        });
        modal.afterClose.pipe().subscribe(res => {
            if (res && this._course) {
                this.courseId$.next(this._course.id);
            }
        });
    }
}
