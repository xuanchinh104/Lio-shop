import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenteditableValueAccessorDirective } from './contenteditable-accessor.directive';

@NgModule({
    declarations: [ContenteditableValueAccessorDirective],
    imports: [CommonModule],
    exports: [ContenteditableValueAccessorDirective],
})
export class ContenteditableAccessorModule {}
