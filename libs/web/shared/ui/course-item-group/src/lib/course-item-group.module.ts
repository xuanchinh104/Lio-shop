import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseItemGroupComponent } from './course-item-group.component';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';

@NgModule({
    imports: [CommonModule, ConvertUrlPipeModule],
    declarations: [CourseItemGroupComponent],
    exports: [CourseItemGroupComponent],
})
export class CourseItemGroupModule {}
