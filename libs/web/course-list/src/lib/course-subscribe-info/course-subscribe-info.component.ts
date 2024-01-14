import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HocVien, KhoaHoc, NhomKhoaHoc } from '@asc/web/shell/data-access/models';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomEmailValidator, PhoneNumberValidator, validateAllFormFields } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService } from '@asc/shared/services/common';
import { TranslocoService } from '@ngneat/transloco';
import { CourseWebConfig, CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { StorageService } from '@asc/shared/services/storage';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-subscribe-info',
    templateUrl: './course-subscribe-info.component.html',
    styleUrls: ['./course-subscribe-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSubscribeInfoComponent implements OnInit, OnDestroy {
    @Input() set alias(val: string) {
        if (val) {
            this.form.get('alias')?.patchValue(val);
            this.courseWebService
                .get(CourseWebConstant.KHOA_HOC_FOR_WEB + `/KhoaHoc`, {
                    alias: val,
                })
                .pipe(
                    map(res => res.items),
                    takeUntil(this.destroyed$)
                )
                .subscribe(res => {
                    this.khoaHocs = res;
                    this.cdr.detectChanges();
                });
        }
    }

    isSubmited = false;

    form = this.formBuilder.group({
        alias: [null, Validators.required],
        idKhoaHoc: [null, Validators.required],
        hoTen: ['', Validators.required],
        soDienThoai: ['', [Validators.required, PhoneNumberValidator]],
        email: ['', [Validators.required, CustomEmailValidator]],
        ghiChu: [''],
    });

    nhomKhoaHocs: NhomKhoaHoc[] = [];

    khoaHocs: KhoaHoc[] = [];

    private destroyed$ = new Subject();

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private formBuilder: FormBuilder,
        private modalRef: NzModalRef,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService,
        private translocoService: TranslocoService,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        const studentInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
        if (studentInfo) {
            this.form.get('hoTen')?.setValue(studentInfo.hoTen);
            this.form.get('soDienThoai')?.setValue(studentInfo.soDienThoai);
            this.form.get('email')?.setValue(studentInfo.email);
        }

        this.courseWebService
            .getNhomKhoaHoc()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                this.nhomKhoaHocs = res;
                this.cdr.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    changeNhomKhoaHoc(alias: string): void {
        this.form.get('idKhoaHoc')?.setValue(null);
        if (alias) {
            this.courseWebService
                .get(CourseWebConstant.KHOA_HOC_FOR_WEB + `/KhoaHoc`, {
                    alias,
                })
                .pipe(
                    map(res => res.items),
                    takeUntil(this.destroyed$)
                )
                .subscribe(res => (this.khoaHocs = res));
        } else {
            this.khoaHocs = [];
        }
        this.cdr.detectChanges();
    }

    closeForm(result = false): void {
        this.modalRef.close(result);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            // validateAllFormFields(this.form);
        } else {
            const data = {
                idKhoaHoc: this.form.get('idKhoaHoc')?.value,
                hoTen: this.form.get('hoTen')?.value,
                soDienThoai: this.form.get('soDienThoai')?.value,
                email: this.form.get('email')?.value,
                ghiChu: this.form.get('ghiChu')?.value,
            };
            this.isSubmited = true;
            this.courseWebService
                .post(CourseWebConstant.HOC_VIEN_DANG_KY_FOR_WEB, data)
                .pipe(
                    finalize(() => {
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notificationService.showSuccessMessage(this.translocoService.translate('DANG_KY_THONG_TIN_SUCCESS'));
                    this.closeForm(true);
                });
        }
    }

    refreshForm(): void {
        this.form.reset();
    }
}
