import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractNgModelComponent } from './ng-model.component';

@NgModule({
    declarations: [AbstractNgModelComponent],
    imports: [CommonModule],
    exports: [AbstractNgModelComponent],
})
export class AbstractControlModule {}
