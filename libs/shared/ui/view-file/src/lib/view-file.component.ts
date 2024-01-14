import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { MessageConstant } from '@asc/core/constants';
import { NotificationService } from '@asc/shared/services/common';

@Component({
    selector       : 'asc-view-file',
    templateUrl    : './view-file.component.html',
    styleUrls      : ['./view-file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewFileComponent implements OnDestroy {
    _fileType = '';
    @Input() viewHeight = '90vh';
    @Input() isHoSo = true;

    _filePath = '';

    @Input() set filePath(value: string) {
        if (value) {
            const listPath: string[] = value.split('.');
            this._fileType = listPath[listPath.length - 1].toLowerCase();
            this._filePath = value;
        }
    }

    _fileName = '';

    @Input() set fileName(value: string) {
        if (value) {
            this._fileName = value;
        }
    }

    private destroyed$ = new Subject();

    constructor(private ref: NzModalRef, @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
                private notification: NotificationService) {
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // onDownloadFile(): void {
    //     window.open(this.env.mediaServer + '/' + this._filePath, '_blank');
    // }

    onDownloadFile(): void {
        fetch(this.env.mediaServer + '/' + this._filePath)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const image = document.createElement('a');
                image.style.display = 'none';
                image.href = url;

                // file name
                image.download = this._fileName;
                document.body.appendChild(image);
                image.click();
                window.URL.revokeObjectURL(url);
            }).catch(() => this.notification.showErrorMessage(MessageConstant.COMMON.MSG_DOWNLOAD_IMAGE_ERROR));
    }

    closeModal(): void {
        this.ref.close();
    }

    handleMissingImage(event: Event): void {
        (event.target as HTMLImageElement).src = '../assets/images/img/image-default.jpg';
    }
}
