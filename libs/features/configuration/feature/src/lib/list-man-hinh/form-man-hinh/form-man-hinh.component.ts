import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { ConfigurationConstant, NhomManHinh } from '@asc/features/configuration/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessageConstant } from '@asc/core/constants';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-form-man-hinh',
    templateUrl: './form-man-hinh.component.html',
    styleUrls: ['./form-man-hinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormManHinhComponent implements OnDestroy {
    @Input() set idFunctionGroup(value: number) {
        if (value) {
            this.form.get('idFunctionGroup')?.setValue(value);
        }
    }

    _formState!: FormState<NhomManHinh>;

    @Input() set formState(state: FormState<NhomManHinh>) {
        this._formState = state;
        if ((state.action === ActionEnum.UPDATE || state.action === ActionEnum.DUPLICATE) && state.data) {
            this.form.patchValue(state.data);
        }
    }

    isSubmited = false;

    form = this.formBuilder.group({
        id: [null],
        name: ['', Validators.required],
        shortName: [''],
        controllerName: [''],
        notes: [''],
        path: [],
        cssClass: [],
        order: [],
        isActive: [true],
        idFunctionGroup: [null, Validators.required],
    });

    actionEnum = ActionEnum;

    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private notification: NotificationService,
        private modalRef: NzModalRef
    ) {}

    get keyTitle(): string {
        if (this._formState.action === this.actionEnum.CREATE) {
            return 'MODULE.MAN_HINH_ADD';
        }
        if (this._formState.action === this.actionEnum.UPDATE) {
            return 'MODULE.MAN_HINH_UPDATE';
        }
        return 'MODULE.MAN_HINH_DUPLICATE';
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isSubmited = true;
            switch (this._formState.action) {
                case ActionEnum.CREATE:
                    this.rbacService
                        .post(ConfigurationConstant.FUNCTION, this.form.value)
                        .pipe(
                            finalize(() => (this.isSubmited = false)),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.close(true);
                        });
                    break;
                case ActionEnum.DUPLICATE:
                    this.form.get('id')?.setValue(null);
                    this.rbacService
                        .post(ConfigurationConstant.FUNCTION, this.form.value)
                        .pipe(
                            finalize(() => (this.isSubmited = false)),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.close(true);
                        });
                    break;
                case ActionEnum.UPDATE:
                    this.rbacService
                        .put(ConfigurationConstant.FUNCTION, this.form.value)
                        .pipe(
                            finalize(() => (this.isSubmited = false)),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_UPDATE_DONE);
                            this.close(true);
                        });
                    break;
            }
        }
    }

    close(result = false): void {
        this.modalRef.close(result);
    }

    zoomForm(isZoom: boolean): void {
        if (isZoom) {
            this.modalRef.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.modalRef.updateConfig({
                nzWrapClassName: '',
            });
        }
    }
}
