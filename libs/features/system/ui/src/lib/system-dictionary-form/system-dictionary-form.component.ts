import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { AclConstant, EProjectType, SystemDictionary } from '@asc/features/system/data-access/models';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { validateAllFormFields } from '@asc/shared/utils';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-nx-system-dictionary-form',
    templateUrl: './system-dictionary-form.component.html',
    styleUrls: ['./system-dictionary-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemDictionaryFormComponent implements OnDestroy {
    _formState!: FormState<SystemDictionary>;
    @Input() set formState(state: FormState<SystemDictionary>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.patchValue(state.data);
        }
    }

    @Input() projectType: EProjectType = EProjectType.DTNN;
    actionEnum = ActionEnum;
    form = this.formBuilder.group({
        id: [null],
        projectType: [this.projectType, Validators.required],
        keyName: ['', Validators.required],
        valueVI: [''],
        valueEN: [''],
        ghiChu: [''],
    });
    isSubmited = false;
    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef,
        private ref: NzModalRef,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        }
        this.isSubmited = true;
        switch (this._formState.action) {
            case ActionEnum.CREATE:
                this.rbacService
                    .post(AclConstant.ACL_SYSLABEL, this.form.value)
                    .pipe(
                        finalize(() => {
                            this.isSubmited = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(() => {
                        this.notification.showSuccessMessage(this.translocoService.translate('MSG_CREATE_DONE'));
                        this.closeForm(true);
                    });
                break;
            case ActionEnum.UPDATE:
                this.rbacService
                    .put(AclConstant.ACL_SYSLABEL, this.form.value)
                    .pipe(
                        finalize(() => {
                            this.isSubmited = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(() => {
                        this.notification.showSuccessMessage(this.translocoService.translate('MSG_UPDATE_DONE'));
                        this.closeForm(true);
                    });
                break;
        }
    }

    closeForm(isLoad = false): void {
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
}
