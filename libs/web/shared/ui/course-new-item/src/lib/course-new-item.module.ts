import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNewItemComponent } from './course-new-item.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { RouterModule } from '@angular/router';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { CourseNewItemKttaComponent } from './course-new-item-ktta/course-new-item-ktta.component';

@NgModule({
    imports: [CommonModule, SvgIconsModule, RouterModule, ConvertUrlModule],
    declarations: [CourseNewItemComponent, CourseNewItemKttaComponent],
    exports: [CourseNewItemComponent, CourseNewItemKttaComponent],
})
export class CourseNewItemModule {}
