import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { CustomEmailValidator, NumberValidator, validateAllFormFields } from '@asc/shared/utils';
import { FormGroup, Validators } from '@angular/forms';
import { ActionEnum, ModuleTypeEnum } from '@asc/shared/data-access';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { UserOfList, UserTypeEnum } from '@asc/features/system/data-access/models';
import { BaseSystemFormComponent } from '@asc/features/system/data-access/base';
import { AuthService } from '@asc/core/auth/services';
import { CourseService } from '@asc/features/shell/data-access/service';

const FORM_PARAMS = {
    userName: 'userName',
    password: 'password',
};

@Component({
    selector: 'asc-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent extends BaseSystemFormComponent<UserOfList> implements OnInit {
    @Input() model!: UserOfList;
    @Input() action!: ActionEnum;
    form!: FormGroup;
    isSubmited = false;

    phongBans$ = this.courseService.getPhongBans();

    userType = UserTypeEnum;

    constructor(
        injector: Injector,
        private authService: AuthService,
        private courseService: CourseService,
        private cdr: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initForm();
        if (this.model) {
            this.form.patchValue(this.model);
            if (this.model.userType === UserTypeEnum.HOC_VIEN_DAO_TAO_NGAN_HAN) {
                this.form.get('idPhongBan')?.clearValidators();
                this.form.get('idPhongBan')?.updateValueAndValidity();
            }

            // remove some control
            this.form.removeControl(FORM_PARAMS.userName);
            this.form.removeControl(FORM_PARAMS.password);
        }
    }

    initForm(): void {
        this.form = this.formBuilder.group({
            id: [null],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: [''],
            email: ['', CustomEmailValidator],
            mobileNumber: ['', [NumberValidator]],
            phoneNumber: ['', [NumberValidator]],
            userName: ['', Validators.required],
            password: ['', Validators.required],
            idCoSo: [null],
            idPhongBan: [null, Validators.required],
            idChucVu: [null],
            userType: UserTypeEnum.NHAN_SU,
            avatarUrl: [''],
            idMap: [null],
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            // trigger validate all field
            validateAllFormFields(this.form);
        }

        if (this.form.valid) {
            this.isSubmited = true;
            const data = {
                ...this.form.value,
                moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
            };
            switch (this.action) {
                case ActionEnum.CREATE:
                    this.authService
                        .createUser(data)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                                this.cdr.detectChanges();
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.closeForm(true);
                        });
                    break;
                case ActionEnum.UPDATE:
                    this.authService
                        .updateUser(this.form.value)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                                this.cdr.detectChanges();
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_UPDATE_DONE);
                            this.closeForm(true);
                        });
                    break;
            }
        }
    }
}
