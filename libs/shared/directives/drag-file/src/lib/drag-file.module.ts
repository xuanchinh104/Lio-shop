import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragFileDirective } from './drag-file.directives';

@NgModule({
    declarations: [DragFileDirective],
    imports: [CommonModule],
    exports: [DragFileDirective],
})
export class DragFileModule {}
