import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonListComponent } from './skeleton-list/skeleton-list.component';

const UIs = [SkeletonListComponent];

@NgModule({
    imports: [CommonModule],
    declarations: [...UIs],
    exports: [UIs],
})
export class SkeletonModule {}
