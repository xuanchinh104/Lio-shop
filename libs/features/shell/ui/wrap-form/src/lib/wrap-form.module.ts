import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapFormComponent } from './wrap-form.component';
import { TranslocoModule } from '@ngneat/transloco';
import { IconModule } from '@asc/shared/ui/icon';

@NgModule({
    imports: [CommonModule, TranslocoModule, IconModule],
    declarations: [WrapFormComponent],
    exports: [WrapFormComponent],
})
export class WrapFormModule {}
