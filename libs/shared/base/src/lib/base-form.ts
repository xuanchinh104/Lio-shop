import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormState } from '@asc/shared/data-access';

@Directive()
export abstract class BaseFormComponent<T> implements OnDestroy {
    _formState!: FormState<T>;
    isCreateAndAddNew = false;

    // @Input() set formState(state: FormState<T>) {
    //     this._formState = state;
    //     if (state.action === ActionEnum.UPDATE && state.data) {
    //         // this.form.patchValue(state.data);
    //     }
    //     this.isCreateAndAddNew = [ActionEnum.CREATE, ActionEnum.DUPLICATE].includes(this._formState.action);
    // }

    protected destroyed$ = new Subject();

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
