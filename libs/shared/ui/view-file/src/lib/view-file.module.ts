import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFileComponent } from './view-file.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DocumentViewerModule } from '@asc/shared/modules/document-viewer';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IconModule } from '@asc/shared/ui/icon';
import { TranslocoModule } from '@ngneat/transloco';

const LIBs = [
    CommonModule,
    DocumentViewerModule,
    ConvertUrlPipeModule,
    IconModule,
    TranslocoModule,

    NzModalModule,
    NzDropDownModule,
];

@NgModule({
    imports     : [...LIBs],
    declarations: [ViewFileComponent],
    exports     : [ViewFileComponent],
})
export class ViewFileModule {}
