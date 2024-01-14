import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from './form-control.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormControlService } from './services/form-control.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { DefaultValuePipeModule } from '@asc/shared/directives/default-value';
import { AbstractControlModule } from '@asc/shared/modules/abstract-control';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { UIInputComponent } from './ui-input/ui-input.component';
import { CurrencyMaskModule } from '@asc/shared/ui/currency-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzPopoverModule,
        NzCheckboxModule,
        CKEditorModule,
        DefaultValuePipeModule,
        AbstractControlModule,
        CurrencyMaskModule,
    ],
    declarations: [FormControlComponent, UIInputComponent],
    exports: [FormControlComponent, UIInputComponent],
    providers: [FormControlService],
})
export class FormControlModule {}
