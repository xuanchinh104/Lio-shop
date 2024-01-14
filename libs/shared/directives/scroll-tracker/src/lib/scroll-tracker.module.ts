import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollTrackerDirective } from './scroll-tracker.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ScrollTrackerDirective],
    exports: [ScrollTrackerDirective],
})
export class ScrollTrackerModule {}
