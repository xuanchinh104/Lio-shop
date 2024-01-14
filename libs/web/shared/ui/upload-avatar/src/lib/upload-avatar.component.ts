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
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-upload-avatar',
    templateUrl: './upload-avatar.component.html',
    styleUrls: ['./upload-avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAvatarComponent {
    @ViewChild('fileInput') fileInput?: ElementRef | null;
    @Input() set hinhAnh(value: string) {
        if (value) {
            this.avatarPreView = `${this.env.mediaServer}/${value}`;
        }
    }
    @Output() avatar = new EventEmitter<string>();
    @Input() titleUpload!: string;

    avatarPreView?: string;
    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private fileService: FileService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService
    ) {}

    uploadFile(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        const imageExt = ['jpg', 'jpeg', 'png', 'JPG', 'PNG', 'JPEG'];
        const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
        const fileItem = fileList[0].name.split('.');
        const isImage = imageExt.includes(fileItem[fileItem.length - 1]);
        if (isImage) {
            if (isLt20MB) {
                this.fileService
                    .uploadFile(fileList)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(
                        (res: FileRequest) => {
                            this.clearValueInput();
                            this.avatarPreView = `${this.env.mediaServer}/${res.url}`;
                            this.avatar.emit(res.url);
                            this.cdr.detectChanges();
                        },
                        () => {
                            this.notification.showWarningMessage('Upload File không thành công !');
                            this.clearValueInput();
                        }
                    );
            } else {
                this.notification.showWarningMessage('File phải nhỏ hơn 20MB !');
                this.clearValueInput();
            }
        } else {
            this.notification.showWarningMessage('Chỉ chấp nhận file hình ảnh !');
            this.clearValueInput();
        }
    }

    private clearValueInput(): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = null;
        }
    }
}
