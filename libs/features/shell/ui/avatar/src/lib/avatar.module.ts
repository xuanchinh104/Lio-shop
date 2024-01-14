import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TranslocoModule } from '@ngneat/transloco';
import { ViewAvatarComponent } from './view-avatar/view-avatar.component';

@NgModule({
    declarations: [AvatarComponent, ViewAvatarComponent],
    exports: [AvatarComponent,ViewAvatarComponent],
    imports: [CommonModule, SvgIconsModule, SafeHtmlPipeModule, ConvertUrlModule, NzPopoverModule, NzMenuModule, TranslocoModule],
})
export class AvatarModule {}
