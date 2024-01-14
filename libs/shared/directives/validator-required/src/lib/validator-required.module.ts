import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { ControlErrorsDirective } from './control-errors.directive';
import { FormSubmitDirective } from './form-submit.directive';
import { ControlRequiredDirective } from './control-required.directive';
import { ControlErrorModule } from './control-error/control-error.module';

const Directives = [ControlErrorContainerDirective, ControlErrorsDirective, FormSubmitDirective, ControlRequiredDirective];

@NgModule({
    declarations: [Directives],
    imports: [CommonModule, ControlErrorModule],
    exports: [Directives],
})
export class ValidatorRequiredDirectiveModule {}
