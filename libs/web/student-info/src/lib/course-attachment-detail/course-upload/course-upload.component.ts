import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { LopHocAttachment } from '@asc/web/shell/data-access/models';
import { takeUntil } from 'rxjs/operators';
import { FileService, NotificationService } from '@asc/shared/services/common';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { Subject } from 'rxjs';
import { FileUploadTypeEnum } from '@asc/features/catalog/data-access';
import { ViewFileComponent } from '@asc/shared/ui/view-file';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-course-upload',
    templateUrl: './course-upload.component.html',
    styleUrls: ['./course-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseUploadComponent implements OnDestroy {
    @ViewChild('fileInput') fileInput?: ElementRef | null;

    @Input() index = 0;
    @Input() fileAttach: LopHocAttachment[] = [];
    @Input() soLuongFile = 0;

    @Input() fileType: number[] = [];
    private destroyed$ = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private modal: NzModalService,
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private notification: NotificationService,
        private fileService: FileService,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    upload(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        if (!this.validateFileUploadInValid(fileList)) {
            if (this.fileAttach.filter(m => !m.isDeleted).length + fileList.length > this.soLuongFile) {
                if (this.fileInput) {
                    this.fileInput.nativeElement.value = null;
                }
                this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING4'));
            } else {
                const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
                if (isLt20MB) {
                    this.fileService
                        .uploadFileAttachment(fileList)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(
                            res => {
                                if (this.fileInput) {
                                    this.fileInput.nativeElement.value = null;
                                }
                                res.forEach(m => {
                                    this.fileAttach.push({
                                        displayName: m.fileName,
                                        fileType: m.contentType,
                                        fileName: m.fileName,
                                        filePath: m.url,
                                        fileSize: m.size,
                                    });
                                });

                                if (this.fileInput) {
                                    this.fileInput.nativeElement.value = null;
                                }
                                this.cdr.detectChanges();
                            },
                            () => {
                                if (this.fileInput) {
                                    this.fileInput.nativeElement.value = null;
                                }
                                this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING5'));
                            }
                        );
                } else {
                    this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING6'));
                    if (this.fileInput) {
                        this.fileInput.nativeElement.value = null;
                    }
                }
            }
        }
    }

    onRemove(index: number): void {
        // code here
        const newFileAttach = this.fileAttach[index] ?? null;
        if (newFileAttach.id && newFileAttach.id > 0) {
            this.fileAttach[index].isDeleted = true;
            this.cdr.detectChanges();
        } else {
            this.fileAttach.splice(index, 1);
            this.cdr.detectChanges();
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
                });
        } else {
            window.open(this.env.mediaServer + '/' + link, '_blank');
        }
    }

    validateFileUploadInValid(fileList: any): boolean {
        // debugger
        const newFileList = Array.from(fileList) as any;

        const fileMatching = newFileList.filter((s: { name: string }) => {
            const ext = s.name.split('.').reverse()[0];
            if (ext) {
                const type = this.getTypeFile(ext);
                return !this.fileType.includes(type);
            }

            return s;
        });

        if (fileMatching.length > 0) {
            this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING7'));
            return true;
        }

        return false;
    }

    getTypeFile(ext: string): number {
        const officeExt = ['pptx', 'ppt', 'doc', 'docx', 'xlsx', 'xls'];
        if (officeExt.includes(ext)) {
            return FileUploadTypeEnum.Office;
        }
        switch (ext) {
            case 'png':
                return FileUploadTypeEnum.Image;
            case 'jpg':
                return FileUploadTypeEnum.Image;
            case 'jpeg':
                return FileUploadTypeEnum.Image;
            case 'mp3':
                return FileUploadTypeEnum.Audio;
            case 'mp4':
                return FileUploadTypeEnum.Video;
            case 'mkv':
                return FileUploadTypeEnum.Video;
            case 'flv':
                return FileUploadTypeEnum.Video;
            case 'avi':
                return FileUploadTypeEnum.Video;
            case 'exe':
                return FileUploadTypeEnum.Application;
            default:
                return FileUploadTypeEnum.Undefined;
        }
    }
}
