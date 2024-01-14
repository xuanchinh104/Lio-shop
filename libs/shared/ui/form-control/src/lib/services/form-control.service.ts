import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlBase } from '../models/form-control.base';
import { SafeAny } from '@asc/shared/utils';

@Injectable()
export class FormControlService {
    toFormGroup(formControls: FormControlBase<string>[]): FormGroup {
        const group: SafeAny = {};

        formControls.forEach(control => {
            group[control.key] = control.required
                ? new FormControl(control.value || '', Validators.required)
                : new FormControl(control.value || '');
        });
        return new FormGroup(group);
    }
}
