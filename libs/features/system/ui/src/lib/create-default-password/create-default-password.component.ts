import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { BaseSystemFormComponent } from '@asc/features/system/data-access/base';
import { User, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ComparePasswordValidator, SafeAny, validateAllFormFields } from '@asc/shared/utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthSsoService } from '@asc/shared/services/common';
import { ModuleTypeEnum } from '@asc/shared/data-access';

@Component({
    selector: 'asc-create-default-password',
    templateUrl: './create-default-password.component.html',
    styleUrls: ['./create-default-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDefaultPasswordComponent extends BaseSystemFormComponent<any> {
    @Input() userSelected!: User[];
    form = this.fb.group(
        {
            password: [null, Validators.required],
            cfpassword: [null, Validators.required],
        },
        { validator: ComparePasswordValidator('password', 'cfpassword') }
    );

    isSubmit = false;
    model: any;

    private defaultPassWord!: string;

    protected modal: NzModalService;
    protected authSsoService: AuthSsoService;

    constructor(injector: Injector, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        super(injector);
        this.authSsoService = injector.get(AuthSsoService);
        this.modal = injector.get(NzModalService);
    }

    onSetPassword(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.defaultPassWord = this.form.get('password')?.value;
            this.modal.confirm({
                nzTitle: this.translocoService.translate('WR.DONG_BO_NGUOI_DUNG_TITLE'),
                nzContent: this.translocoService.translate('WR.DONG_BO_NGUOI_DUNG'),
                nzOkText: this.translocoService.translate('WR.OK_DONG_BO'),
                nzOkDanger: false,
                nzOnOk: () => {
                    this.isSubmit = true;
                    this.authSsoService
                        .onSyncUser({ items: this.dataRequestSync(this.userSelected) })
                        .pipe(
                            finalize(() => {
                                this.isSubmit = false;
                                this.cdr.detectChanges();
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(
                            () => {
                                this.notification.showSuccessMessage(this.translocoService.translate('MSG_SYNC_DONE'));
                                this.closeForm(true);
                            },
                            () => this.notification.showErrorMessage(this.translocoService.translate('MSG_ERROR_SYSTEM'))
                        );
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    dataRequestSync(data: User[]): SafeAny {
        return data.map(x => ({
            firstName: x.ten,
            lastName: x.hoDem,
            email: x.email,
            hinhAnh: '',
            phoneNumber: x.soDienThoai,
            mobileNumber: x.soDienThoai,
            address: x.diaChi,
            userName: x.maNhanSu,
            password: this.defaultPassWord,
            avatarUrl: '',
            // idMap: x.idMap ? `${x.idMap}` : null,
            idMap: x.idMap ? `${x.idMap}` : `${x.id}`,
            userType: UserTypeEnum.NHAN_SU,
            idPhongBan: x.idPhongBan,
            idCoSo: null,
            idChucVu: null,
            moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
        }));
    }

    closeForm(isLoad?: boolean): void {
        this.modalRef.close(isLoad);
    }
}
