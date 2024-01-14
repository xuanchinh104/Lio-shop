import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy } from '@angular/core';
import { BaseSystemFormComponent } from '@asc/features/system/data-access/base';
import { ConfigReport } from '@asc/features/system/data-access/models';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { validateAllFormFields } from '@asc/shared/utils';
import { Validators } from '@angular/forms';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-form-config-report',
    templateUrl: './form-config-report.component.html',
    styleUrls: ['./form-config-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormConfigReportComponent extends BaseSystemFormComponent<ConfigReport> implements OnDestroy {
    _formState!: FormState<ConfigReport>;
    @Input() set formState(state: FormState<ConfigReport>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.patchValue(state.data);
        }
        this.isCreateAndAddNew = [ActionEnum.CREATE, ActionEnum.DUPLICATE].includes(this._formState.action);
    }

    isSubmited = false;
    actionEnum = ActionEnum;
    form = this.formBuilder.group({
        id: [null],
        ma: ['', Validators.required],
        ten: ['', Validators.required],
        tieuDe: ['', Validators.required],
        ghiChu: [''],
        soThuTu: [null],
    });

    constructor(injector: Injector, private courseService: CourseService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    get titleKey(): string {
        return this._formState.action === ActionEnum.CREATE ? 'RP.ADD_CAU_HINH_BIEU_MAU' : 'RP.UPDATE_CAU_HINH_BIEU_MAU';
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
                        .post(CatalogConstant.BIEU_MAU_DYNAMICS, this.form.value, true)
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
                        .put(CatalogConstant.BIEU_MAU_DYNAMICS, this.form.value, true)
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
                .post(CatalogConstant.BIEU_MAU_DYNAMICS, this.form.value, true)
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
                });
        }
    }
}
