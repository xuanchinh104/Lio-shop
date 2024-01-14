import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, JwtService } from '@asc/core/auth/services';
import { NotificationService } from '@asc/shared/services/common';
import { ComparePasswordValidator, validateAllFormFields } from '@asc/shared/utils';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-change-password',
    templateUrl: './change-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    form!: FormGroup;

    isLoading = false;

    private destroyed$ = new Subject();

    constructor(
        private courseService: CourseWebService,
        private formBuilder: FormBuilder,
        private jwtService: JwtService,
        private auth: AuthService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
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
                currentPassword: ['', Validators.required],
                newPassword: ['', Validators.required],
                confirmPassword: ['', Validators.required],
            },
            {
                validator: ComparePasswordValidator('newPassword', 'confirmPassword'),
            }
        );
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isLoading = true;
            this.auth
                .changePassword(this.form.value, <string>this.jwtService.getUserId())
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showSuccessMessage(this.translocoService.translate('TEXT_SUCCESS1'));
                    this.initForm();
                });
        }
    }
}
