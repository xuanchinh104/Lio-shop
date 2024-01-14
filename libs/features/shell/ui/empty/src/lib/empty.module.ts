import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from './empty.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    imports: [CommonModule, TranslocoModule],
    declarations: [EmptyComponent],
    exports: [EmptyComponent],
})
export class EmptyModule {}
