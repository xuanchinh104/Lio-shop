import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeNamePipe } from './capitalize-name.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [CapitalizeNamePipe],
    exports: [CapitalizeNamePipe],
})
export class CapitalizeNameModule {}
