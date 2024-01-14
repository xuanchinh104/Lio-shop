import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { FileRequest, FileService, NotificationService } from '@asc/shared/services/common';
import { Subject } from 'rxjs';
import { ViewFileComponent } from '@asc/shared/ui/view-file';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {
    @ViewChild('fileInput') fileInput?: ElementRef | null;
    @Output() fileRequest = new EventEmitter<FileRequest | null>();
    @Input() isXem = true;

    fileName!: string;
    @Input() set fileValue(val: string) {
        if (val) {
            this.fileName = val;
        } else {
            this.fileName = '';
        }
    }

    _fileUrl!: string;
    @Input() set fileUrl(val: string) {
        if (val) {
            this._fileUrl = val;
        } else {
            this._fileUrl = '';
        }
    }

    private destroyed$ = new Subject();

    constructor(
        private fileService: FileService,
        private notification: NotificationService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {}

    private loadFile(fileList: FileList): void {
        const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
        if (isLt20MB) {
            this.fileService
                .uploadFile(fileList)
                .pipe(
                    finalize(() => {
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(
                    (res: FileRequest) => {
                        if (this.fileInput) {
                            this.fileInput.nativeElement.value = null;
                        }
                        this.fileRequest.emit(res);
                        this.fileName = res.fileName;
                        this._fileUrl = res.url;
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
    }

    uploadFile(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        this.loadFile(fileList);
    }

    filesDropped(fileList: FileList): void {
        this.loadFile(fileList);
    }

    removeFile(): void {
        this.fileName = '';
        this.fileRequest.emit(null);
        this.cdr.detectChanges();
    }

    onViewFile(): void {
        this.modal.create({
            nzTitle: '',
            nzContent: ViewFileComponent,
            nzComponentParams: {
                filePath: this._fileUrl,
                fileName: this.fileName,
            },
            nzWrapClassName: 'modal-fullscreen view-file',
            nzFooter: null,
            nzClosable: false,
            nzCloseIcon: '',
        });
    }
}
