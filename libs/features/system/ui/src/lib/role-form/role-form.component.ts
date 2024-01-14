import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { ActionEnum, FormState, ModuleTypeEnum } from '@asc/shared/data-access';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AclConstant, RoleOfList } from '@asc/features/system/data-access/models';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-role-form',
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent implements OnDestroy {
    _formState!: FormState<RoleOfList>;
    @Input() set formState(state: FormState<RoleOfList>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.patchValue(state.data);
        }
    }

    @Input() parentId?: number;

    form = this.formBuilder.group({
        id: [null],
        name: ['', Validators.required],
        idParent: [this.parentId ?? null],
        notes: [''],
        ordering: [0],
        moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
    });

    isSubmited = false;
    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private notification: NotificationService,
        private ref: NzModalRef,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService
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
                        .post(AclConstant.ACL_ROLE, this.form.value)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_CREATE_DONE'));
                            this.close(true);
                        });
                    break;
                case ActionEnum.UPDATE:
                    this.rbacService
                        .put(AclConstant.ACL_ROLE, this.form.value)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_UPDATE_DONE'));
                            this.close(true);
                        });
                    break;
            }
        }
    }

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
}
