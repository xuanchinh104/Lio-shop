import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCardPhotoComponent } from './upload-card-photo.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    imports: [CommonModule, NzPopoverModule, TranslocoModule],
    declarations: [UploadCardPhotoComponent],
    exports: [UploadCardPhotoComponent],
})
export class UploadCardPhotoModule {}
