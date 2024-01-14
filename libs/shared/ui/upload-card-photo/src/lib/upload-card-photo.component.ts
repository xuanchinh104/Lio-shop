import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FileRequest, FileService, NotificationService } from '@asc/shared/services/common';
import { Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { LoaiDoiTuongEnum } from '@asc/shared/data-access';
import { ViewAvatarComponent } from '@asc/features/shell/ui/avatar';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-upload-card-photo',
    templateUrl: './upload-card-photo.component.html',
    styleUrls: ['./upload-card-photo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCardPhotoComponent {
    @ViewChild('fileInputAnhThe') fileInputAnhThe?: ElementRef | null;
    @Output() anhTheUrlChange = new EventEmitter<string>();
    @Output() tenAnhThe = new EventEmitter<string>();

    fileExt = ['png', 'jpeg', 'jpg', 'svg', 'gif', 'webp'];
    fileAccept = this.fileExt.map(x => '.' + x).join(',');

    anhTheUrlPreview?: string;

    @Input() set anhTheUrl(url: string) {
        this.anhTheUrlPreview = url;
    }

    _loaiDoiTuong!: number;
    @Input() set loaiDoiTuong(vl: number) {
        if (vl) {
            this._loaiDoiTuong = vl;
        }
    }

    _tenAnhThe?: string;

    @Input() set tenAnhThePreview(val: string) {
        this._tenAnhThe = val;
    }

    loaiDoiTuongEnum = LoaiDoiTuongEnum;

    mediaServer = this.env.mediaServer;
    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private fileService: FileService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        private translocoService: TranslocoService,
        private modal: NzModalService
    ) {}

    uploadFileAnhThe(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        const fileType = fileList[0].name.split('.').pop();
        const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
        if (fileType && this.fileExt.includes(fileType)) {
            if (isLt20MB) {
                this.fileService
                    .uploadFile(fileList)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(
                        (res: FileRequest) => {
                            if (this.fileInputAnhThe) {
                                this.fileInputAnhThe.nativeElement.value = null;
                            }
                            this.anhTheUrlPreview = res.url;
                            this.anhTheUrlChange.emit(res.url);

                            this._tenAnhThe = res.fileName
                                .replace(/^.*[\\\/]/, '')
                                .split('.')
                                .slice(0, -1)
                                .join('.');
                            this.tenAnhThe.emit(this._tenAnhThe);
                            this.cdr.detectChanges();
                        },
                        () => {
                            this.notification.showWarningMessage(this.translocoService.translate('WR.UPLOAD_FAILED'));
                        }
                    );
            } else {
                this.notification.showWarningMessage(this.translocoService.translate('WR.FILE_SMALLER_THAN_20MB'));
            }
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('IMPORT.FILE_NOT_SUPPORT'));
        }
    }

    viewPhoto(): void {
        this.modal.create({
            nzContent: ViewAvatarComponent,
            nzWrapClassName: 'nz-fullbox view-file',
            nzClosable: false,
            nzComponentParams: {
                avatar: this.anhTheUrlPreview,
            },
            nzFooter: null,
            nzMaskClosable: false,
        });
    }
}
