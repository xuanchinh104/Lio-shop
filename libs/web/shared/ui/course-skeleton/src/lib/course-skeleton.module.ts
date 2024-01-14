import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseSkeletonComponent } from './course-skeleton.component';

@NgModule({
    imports: [CommonModule],
    declarations: [CourseSkeletonComponent],
    exports: [CourseSkeletonComponent],
})
export class CourseSkeletonModule {}
