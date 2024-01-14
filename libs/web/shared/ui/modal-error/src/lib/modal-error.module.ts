import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalErrorComponent } from './modal-error.component';
import { TranslocoModule } from '@ngneat/transloco';
import { AscButtonModule } from '@asc/shared/ui/button';

@NgModule({
    imports: [CommonModule, TranslocoModule, AscButtonModule],
    declarations: [ModalErrorComponent],
})
export class ModalErrorModule {}
