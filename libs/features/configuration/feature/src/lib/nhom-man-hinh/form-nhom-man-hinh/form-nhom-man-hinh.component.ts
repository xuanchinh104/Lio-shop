import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { Subject } from 'rxjs';
import { validateAllFormFields } from '@asc/shared/utils';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { ConfigurationConstant, NhomManHinh } from '@asc/features/configuration/data-access';

@Component({
    selector: 'asc-form-nhom-man-hinh',
    templateUrl: './form-nhom-man-hinh.component.html',
    styleUrls: ['./form-nhom-man-hinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormNhomManHinhComponent {
    @Input() set idModule(value: number) {
        if (value > 0) {
            this.form.get('idModule')?.setValue(value);
        }
    }

    readonly module$ = this.rbacService
        .get(ConfigurationConstant.MODULE_LIST, {
            isActive: true,
        })
        .pipe(
            map(res => res.items),
            shareReplay(1)
        );

    _formState!: FormState<NhomManHinh>;

    @Input() set formState(state: FormState<NhomManHinh>) {
        this._formState = state;
        if ((state.action === ActionEnum.UPDATE || state.action === ActionEnum.DUPLICATE) && state.data) {
            this.form.patchValue(state.data);
        }
    }

    form = this.formBuilder.group({
        id: [null],
        idModule: ['', Validators.required],
        name: ['', Validators.required],
        shortName: [''],
        path: [''],
        controllerName: [''],
        cssClass: [],
        cssBadge: [],
        groupNameIcon: [''],
        order: [0],
        notes: [''],
        isActive: [true],
    });

    isSubmited = false;
    actionEnum = ActionEnum;

    private destroyed$ = new Subject();

    constructor(
        private ref: NzModalRef,
        private formBuilder: FormBuilder,
        private notification: NotificationService,
        private rbacService: RbacService
    ) {}

    close(isLoad = false): void {
        this.ref.close(isLoad);
    }

    zoomForm(isZoom: boolean): void {
        if (isZoom) {
            this.ref.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.ref.updateConfig({
                nzWrapClassName: '',
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            // trigger validate all field
            validateAllFormFields(this.form);
        } else {
            this.isSubmited = true;
            switch (this._formState.action) {
                case ActionEnum.CREATE:
                    this.rbacService
                        .post('FunctionGroups', this.form.value)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.close(true);
                        });
                    break;
                case ActionEnum.DUPLICATE:
                    this.form.get('id')?.setValue(null);
                    this.rbacService
                        .post('FunctionGroups', this.form.value)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.close(true);
                        });
                    break;
                case ActionEnum.UPDATE:
                    this.rbacService
                        .put('FunctionGroups', this.form.value)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_UPDATE_DONE);
                            this.close(true);
                        });
                    break;
            }
        }
    }
}
