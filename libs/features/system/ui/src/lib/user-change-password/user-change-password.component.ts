import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@asc/shared/services/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { ComparePasswordValidator, validateAllFormFields } from '@asc/shared/utils';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@asc/core/auth/services';
import { TranslocoService } from '@ngneat/transloco';

const FORM_PARAMS = {
    newPassword: 'newPassword',
    confirmNewPassword: 'confirmNewPassword',
    ids: 'ids',
};

@Component({
    selector: 'asc-user-change-password',
    templateUrl: './user-change-password.component.html',
    styleUrls: ['./user-change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserChangePasswordComponent implements OnInit, OnDestroy {
    @Input() idUsers: number[] = [];
    form!: FormGroup;

    protected destroyed$ = new Subject();

    constructor(
        private authService: AuthService,
        private notification: NotificationService,
        private formBuilder: FormBuilder,
        private modalRef: NzModalRef,
        private translocoService: TranslocoService
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    initForm(): void {
        this.form = this.formBuilder.group(
            {
                [FORM_PARAMS.newPassword]: ['', Validators.required],
                [FORM_PARAMS.confirmNewPassword]: ['', Validators.required],
                [FORM_PARAMS.ids]: [this.idUsers],
            },
            {
                validator: ComparePasswordValidator(FORM_PARAMS.newPassword, FORM_PARAMS.confirmNewPassword),
            }
        );
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.authService
                .changePasswordByIds({
                    newPassword: this.form.get('newPassword')?.value,
                    ids: this.idUsers,
                })
                .pipe(takeUntil(this.destroyed$))
                .subscribe(() => {
                    this.notification.showSuccessMessage(this.translocoService.translate('TEXT_SUCCESS1'));
                    this.closeModal();
                });
        }
    }

    closeModal(): void {
        this.modalRef.close();
    }
}
