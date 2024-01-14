import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaysAgoDirective } from './days-ago.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [DaysAgoDirective],
    exports: [DaysAgoDirective],
})
export class DaysAgoModule {}
