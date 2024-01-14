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
import { Subject } from 'rxjs';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { FileRequest, FileService, NotificationService } from '@asc/shared/services/common';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntil } from 'rxjs/operators';
import { LoaiDoiTuongEnum } from '@asc/shared/data-access';

@Component({
    selector: 'asc-upload-card-photo-web',
    templateUrl: './upload-card-photo.component.html',
    styleUrls: ['./upload-card-photo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCardPhotoComponent {
    @ViewChild('fileInputAnhThe') fileInputAnhThe?: ElementRef | null;
    @Output() anhTheUrlChange = new EventEmitter<string>();
    @Output() tenAnhThe = new EventEmitter<string>();

    anhTheUrlPreview?: string;
    @Input() set anhTheUrl(url: string) {
        this.anhTheUrlPreview = url;
    }

    _tenAnhThe?: string;
    @Input() set tenAnhThePreview(val: string) {
        if (val) {
            this._tenAnhThe = val;
        }
    }

    _loaiDoiTuong!: number;
    @Input() set loaiDoiTuong(vl: number) {
        if (vl) {
            this._loaiDoiTuong = vl;
        }
    }

    loaiDoiTuongEnum = LoaiDoiTuongEnum;

    mediaServer = this.env.mediaServer;

    fileExt = ['png', 'jpeg', 'jpg', 'svg', 'gif', 'webp'];
    fileAccept = this.fileExt.map(x => '.' + x).join(',');

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private fileService: FileService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        private translocoService: TranslocoService
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
                            this._tenAnhThe = res.fileName
                                .replace(/^.*[\\\/]/, '')
                                .split('.')
                                .slice(0, -1)
                                .join('.');
                            this.tenAnhThe.emit(this._tenAnhThe);
                            this.anhTheUrlChange.emit(res.url);
                            this.cdr.detectChanges();
                        },
                        () => {
                            this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING5'));
                        }
                    );
            } else {
                this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING6'));
            }
        } else {
            this.notification.showWarningMessage('File không được hỗ trợ !');
        }
    }
}
