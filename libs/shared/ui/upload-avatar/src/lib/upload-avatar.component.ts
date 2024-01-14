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
import { FileRequest, FileService, NotificationService } from '@asc/shared/services/common';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

export const imageExt = ['jpg', 'jpeg', 'png'];

@Component({
    selector: 'asc-upload-avatar',
    templateUrl: './upload-avatar.component.html',
    styleUrls: ['./upload-avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAvatarComponent {
    @Input() height = 190;
    @Input() width = 190;
    @Input() rounded = 0;
    @Output() avatarUrlChange = new EventEmitter<string>();
    @ViewChild('fileInput') fileInput?: ElementRef | null;

    @Input() set avatarUrl(url: string) {
        this.avatarUrlView = url;
    }

    avatarUrlView?: string;
    isLoadingImg = false;
    mediaServer = this.env.mediaServer;

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private notification: NotificationService,
        private upLoadAvatarService: FileService,
        private cdr: ChangeDetectorRef
    ) {}

    uploadFile(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        this.loadFile(fileList);
    }

    filesDropped(fileList: FileList): void {
        this.loadFile(fileList);
    }

    removeImage(): void {
        this.avatarUrlView = undefined;
        this.avatarUrlChange.emit(this.avatarUrlView);
        this.cdr.detectChanges();
    }

    private loadFile(fileList: FileList): void {
        const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
        const fileItem = fileList[0].name.split('.');
        const isImage = imageExt.includes(fileItem[fileItem.length - 1]);
        if (isImage) {
            if (isLt20MB) {
                this.isLoadingImg = true;
                this.upLoadAvatarService
                    .uploadFile(fileList)
                    .pipe(
                        finalize(() => {
                            this.isLoadingImg = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(
                        (res: FileRequest) => {
                            if (this.fileInput) {
                                this.fileInput.nativeElement.value = null;
                            }
                            this.avatarUrlView = res.url;
                            this.avatarUrlChange.emit(this.avatarUrlView);
                            this.cdr.detectChanges();
                        },
                        () => {
                            this.notification.showWarningMessage('Upload File không thành công !');
                            if (this.fileInput) {
                                this.fileInput.nativeElement.value = null;
                            }
                        }
                    );
            } else {
                this.notification.showWarningMessage('File phải nhỏ hơn 20MB !');
                if (this.fileInput) {
                    this.fileInput.nativeElement.value = null;
                }
            }
        } else {
            this.notification.showWarningMessage('Chỉ chấp nhận file hình ảnh !');
            if (this.fileInput) {
                this.fileInput.nativeElement.value = null;
            }
        }
    }
}
