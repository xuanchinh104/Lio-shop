import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAvatarComponent } from './upload-avatar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    imports: [CommonModule, SvgIconsModule, TranslocoModule],
    declarations: [UploadAvatarComponent],
    exports: [UploadAvatarComponent],
})
export class UploadAvatarModule {}
