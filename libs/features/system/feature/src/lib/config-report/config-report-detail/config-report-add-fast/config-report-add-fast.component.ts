import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy } from '@angular/core';
import { BaseSystemFormComponent } from '@asc/features/system/data-access/base';
import { ConfigReportDetail } from '@asc/features/system/data-access/models';
import { CourseService } from '@asc/features/shell/data-access/service';
import { Validators } from '@angular/forms';
import { validateAllFormFields } from '@asc/shared/utils';
import { CatalogConstant } from '@asc/features/catalog/data-access';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'asc-config-report-add-fast',
    templateUrl: './config-report-add-fast.component.html',
    styleUrls: ['./config-report-add-fast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigReportAddFastComponent extends BaseSystemFormComponent<ConfigReportDetail> implements OnDestroy {
    @Input() idSysBieuMauDynamic!: number;

    form = this.formBuilder.group({
        jsonData: ['', Validators.required],
    });

    isSubmited = false;

    constructor(injector: Injector, private courseService: CourseService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    get titleKey(): string {
        return 'LB.ADD_FAST_DATA';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        }
        if (this.form.valid) {
            const data = {
                idSysBieuMauDynamic: this.idSysBieuMauDynamic,
                jsonData: this.form.get('jsonData')?.value,
            };
            this.isSubmited = true;
            this.courseService
                .post(CatalogConstant.BIEU_MAU_DYNAMICS + '/Detail', data, true)
                .pipe(
                    finalize(() => {
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showSuccessMessage(this.translocoService.translate('RP.ADD_DATA_SUCCESS'));
                    this.closeForm(true);
                });
        }
    }
}
