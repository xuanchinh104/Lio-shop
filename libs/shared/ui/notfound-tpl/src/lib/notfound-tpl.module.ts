import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundTplComponent } from './notfound-tpl.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
    imports: [CommonModule, NzIconModule],
    declarations: [NotfoundTplComponent],
    exports: [NotfoundTplComponent],
})
export class NotfoundTplModule {}
