import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportDataComponent } from './import-data.component';
import { AscButtonModule } from '@asc/shared/ui/button';
import { DragFileModule } from '@asc/shared/directives/drag-file';
import { FilterMenuModule } from '@progress/kendo-angular-treelist';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidatorRequiredDirectiveModule } from '@asc/shared/directives/validator-required';
import { WrapFormModule } from '@asc/features/shell/ui/wrap-form';

@NgModule({
    imports: [
        CommonModule,
        AscButtonModule,
        DragFileModule,
        FilterMenuModule,
        FormsModule,
        TranslocoModule,
        ValidatorRequiredDirectiveModule,
        WrapFormModule,
    ],
    declarations: [ImportDataComponent],
})
export class ImportDataModule {}
