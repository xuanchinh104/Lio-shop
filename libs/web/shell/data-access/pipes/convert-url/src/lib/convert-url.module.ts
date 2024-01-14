import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertUrlPipe } from './convert-url.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [ConvertUrlPipe],
    exports: [ConvertUrlPipe],
})
export class ConvertUrlModule {}
