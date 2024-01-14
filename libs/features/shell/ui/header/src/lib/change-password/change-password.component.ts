import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TokenInfo } from '@asc/core/auth/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ComparePasswordValidator, validateAllFormFields } from '@asc/shared/utils';
import { ApiService, NotificationService } from '@asc/shared/services/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { AuthService } from '@asc/core/auth/services';
import { UrlConstant } from '@asc/core/constants';

@Component({
    selector: 'asc-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    user?: TokenInfo | null;

    formChangePassword = this.formBuilder.group(
        {
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmNewPassword: ['', Validators.required],
        },
        {
            validator: ComparePasswordValidator('newPassword', 'confirmNewPassword'),
        }
    );
    private destroyed$ = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private notification: NotificationService,
        private modal: NzModalRef,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authService
            .getUserInfo()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(value => {
                this.user = value;
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onChangePassword(): void {
        if (this.formChangePassword.invalid) {
            validateAllFormFields(this.formChangePassword);
        } else {
            if (this.formChangePassword.get('newPassword')?.value === this.formChangePassword.get('oldPassword')?.value) {
                this.notification.showErrorMessage('Mật khẩu mới không được giống mật khẩu cũ!');
            } else {
                const data = {
                    userName: this.user?.username,
                    currentPassword: this.formChangePassword.get('oldPassword')?.value,
                    newPassword: this.formChangePassword.get('newPassword')?.value,
                };

                this.authService
                    .changePassword(data, <string>this.user?.sub)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(() => {
                        this.notification.showSuccessMessage('Cập nhật mật khẩu thành công');
                        this.close();
                    });
            }
        }
    }

    onLogoutAll(): void {
        this.apiService
            .post(UrlConstant.API.ACL_USER_DEVICE_DETAIL, {
                pageNumber: 0,
                pageSize: 0,
            })
            .pipe(
                map(userDevices => {
                    if (userDevices?.result && userDevices.result.items) {
                        return userDevices.result.items.map((x: any) => x.deviceHash);
                    }
                }),
                switchMap(userDevices =>
                    this.apiService.post(UrlConstant.API.ACL_ACCOUNT + '/Logout', {
                        deviceHash: userDevices,
                        isCurrentUserLogout: false,
                    })
                ),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    close(): void {
        this.modal.destroy();
    }
}
