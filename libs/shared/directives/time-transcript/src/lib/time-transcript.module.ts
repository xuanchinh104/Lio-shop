import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTranscriptDirective } from './time-transcript.directive';

@NgModule({
    declarations: [TimeTranscriptDirective],
    imports: [CommonModule],
    exports: [TimeTranscriptDirective],
})
export class TimeTranscriptModule {}
