import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UploadFileComponent } from './upload-file.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DragFileModule } from '@asc/shared/directives/drag-file';
import { FileTypeModule } from '@asc/shared/pipes/file-type';
import { SvgIconsModule } from '@ngneat/svg-icon';

@NgModule({
    imports: [CommonModule, NzUploadModule, NzIconModule, NzButtonModule, DragFileModule, FileTypeModule, SvgIconsModule],
    declarations: [UploadFileComponent],
    exports: [UploadFileComponent],
})
export class UploadFileModule {}
