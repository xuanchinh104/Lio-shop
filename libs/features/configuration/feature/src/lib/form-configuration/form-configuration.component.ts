import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Configuration, ConfigurationConstant } from '@asc/features/configuration/data-access';

@Component({
    selector: 'asc-form-configuration',
    templateUrl: './form-configuration.component.html',
    styleUrls: ['./form-configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConfigurationComponent implements OnDestroy {
    _formState!: FormState<Configuration>;

    @Input() set formState(state: FormState<Configuration>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.patchValue(state.data);
        }
    }

    form = this.formBuilder.group({
        id: [null],
        keyModule: ['', Validators.required],
        tenModule: ['', Validators.required],
        moTa: [''],
        cssClass: [''],
        cssIcon: [''],
        soThuTu: [0],
        isActive: [true],
        groupName: ['', Validators.required],
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
                        .post(ConfigurationConstant.MODULE, this.form.value)
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
                        .put(ConfigurationConstant.MODULE, this.form.value)
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
