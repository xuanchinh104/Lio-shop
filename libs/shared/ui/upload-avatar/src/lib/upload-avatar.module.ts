import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAvatarComponent } from './upload-avatar.component';
import { TranslocoModule } from '@ngneat/transloco';
import { DragFileModule } from '@asc/shared/directives/drag-file';

@NgModule({
    imports: [CommonModule, TranslocoModule, DragFileModule],
    declarations: [UploadAvatarComponent],
    exports: [UploadAvatarComponent],
})
export class UploadAvatarModule {}
