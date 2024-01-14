import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { Validators } from '@angular/forms';
import { CourseService } from '@asc/features/shell/data-access/service';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { BaseWebManagerForm, DanhMucTinTuc, WebManagerConstant } from '@asc/features/website-manager/data-access';

@Component({
    selector: 'asc-form-danh-muc-tin-tuc',
    templateUrl: './form-danh-muc-tin-tuc.component.html',
    styleUrls: ['./form-danh-muc-tin-tuc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDanhMucTinTucComponent extends BaseWebManagerForm<DanhMucTinTuc> implements OnDestroy {
    _formState!: FormState<DanhMucTinTuc>;

    @Input() set formState(state: FormState<DanhMucTinTuc>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.patchValue(state.data);
        }
        this.isCreateAndAddNew = [ActionEnum.CREATE, ActionEnum.DUPLICATE].includes(this._formState.action);
    }

    form = this.formBuilder.group({
        id: [null],
        tenDanhMuc: ['', Validators.required],
        isHienThi: [true],
        ghiChu: [''],
    });

    isSubmited = false;
    actionEnum = ActionEnum;

    constructor(injector: Injector, private courseService: CourseService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    get titleKey(): string {
        return this._formState.action === ActionEnum.CREATE ? 'WEB.ADD_DANH_MUC' : 'WEB.UPDATE_DANH_MUC';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isSubmited = true;
            switch (this._formState.action) {
                case ActionEnum.CREATE:
                    this.courseService
                        .post(WebManagerConstant.DANH_MUC_TIN_TUC, this.form.value, true)
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
                    this.courseService
                        .put(WebManagerConstant.DANH_MUC_TIN_TUC, this.form.value, true)
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

    onSaveAndAddNew(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isCheckSaveAndAdd = true;
            this.isLoadingSaveAndCreate = true;
            this.courseService
                .post(WebManagerConstant.DANH_MUC_TIN_TUC, this.form.value, true)
                .pipe(
                    finalize(() => {
                        this.isLoadingSaveAndCreate = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                    this.form.reset();
                    this.form.get('isHienThi')?.setValue(true);
                });
        }
    }
}
