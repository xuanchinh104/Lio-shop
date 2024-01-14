import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { ActionTypeDescription, ChucNang, ConfigurationConstant } from '@asc/features/configuration/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessageConstant } from '@asc/core/constants';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'asc-form-chuc-nang',
    templateUrl: './form-chuc-nang.component.html',
    styleUrls: ['./form-chuc-nang.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormChucNangComponent implements OnInit, OnDestroy {
    @Input() set idFunction(value: number) {
        if (value) {
            this.form.get('idFunction')?.setValue(value);
        }
    }

    _formState!: FormState<ChucNang>;

    @Input() set formState(state: FormState<ChucNang>) {
        this._formState = state;
        if ((state.action === ActionEnum.UPDATE || state.action === ActionEnum.DUPLICATE) && state.data) {
            this.form.patchValue(state.data);
        }
    }

    form = this.formBuilder.group({
        id: [null],
        name: ['Xem', Validators.required],
        actionName: ['', Validators.required],
        controllerName: [''],
        notes: [''],
        idFunction: [null],
        actionType: [1],
        optionKey: [''],
    });
    isSubmited = false;
    actionEnum = ActionEnum;

    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private notification: NotificationService,
        private modalRef: NzModalRef
    ) {}

    ngOnInit(): void {
        this.form
            .get('actionType')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.getTenChucNang();
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    getTenChucNang(): void {
        this.form.get('name')?.setValue(ActionTypeDescription[this.form.get('actionType')?.value]);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        }

        if (this.form.valid) {
            this.isSubmited = true;
            switch (this._formState.action) {
                case ActionEnum.CREATE:
                    this.rbacService
                        .post(ConfigurationConstant.ACTION, this.form.value)
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
                        .post(ConfigurationConstant.ACTION, this.form.value)
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
                        .put(ConfigurationConstant.ACTION, this.form.value)
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
