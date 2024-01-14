import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@asc/shared/services/common';
import { StorageService } from '@asc/shared/services/storage';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { CourseWebConfig, CourseWebConstant, HinhThucNhanEnum } from '@asc/web/shell/data-access/constant';
import { HocVien, LopHocRegistered } from '@asc/web/shell/data-access/models';
import { TranslocoService } from '@ngneat/transloco';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'asc-hinh-thuc-nhan-bang',
    templateUrl: './hinh-thuc-nhan-bang.component.html',
    styleUrls: ['./hinh-thuc-nhan-bang.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HinhThucNhanBangComponent implements OnInit, OnDestroy {
    _formState!: FormState<LopHocRegistered>;
    @Input() set formState(state: FormState<LopHocRegistered>) {
        this._formState = state;
        this.form.get('idHocVienDangKy')?.setValue(this._formState.data?.id);
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.form.get('idVanBang')?.setValue(state.data.idVanBang);
            this.form.patchValue(state.data);
            this.form.get('id')?.setValue(state.data.idHinhThucNhanBang);
            this.form.get('soDienThoai')?.setValue(state.data.soDienThoaiNguoiNhan);
            this.form.get('hoTen')?.setValue(state.data.hoTenNguoiNhan);
            this.form.get('soNhaNguoiNhan')?.setValue(state.data.soNhaNguoiNhan);
            setTimeout(() => {
                this.form.get('idTinhNguoiNhan')?.setValue(state.data?.idTinhNguoiNhan);
                this.form.get('idHuyenNguoiNhan')?.setValue(state.data?.idHuyenNguoiNhan);
                this.form.get('idXaNguoiNhan')?.setValue(state.data?.idXaNguoiNhan);
            }, 0);
        }
    }

    form = this.formBuilder.group({
        id: [null],
        idHinhThuc: [HinhThucNhanEnum.TRUC_TIEP],
        idHocVienDangKy: [null],
        hoTen: ['', Validators.required],
        soDienThoai: ['', Validators.required],
        idTinhNguoiNhan: [null, Validators.required],
        idHuyenNguoiNhan: [null, Validators.required],
        idXaNguoiNhan: [null, Validators.required],
        soNhaNguoiNhan: ['', Validators.required],
        idVanBang: [null],
    });

    isCopy = false;
    actionEnum = ActionEnum;

    tinhThanh$ = this.courseWebService.getTinhThanhs().pipe(shareReplay(1));

    qHuyen$ = this.form.get('idTinhNguoiNhan')?.valueChanges.pipe(
        switchMap((idTinhTP: number) => {
            this.form.get('idHuyenNguoiNhan')?.setValue(null);
            this.form.get('idXaNguoiNhan')?.setValue(null);
            if (idTinhTP) {
                return this.courseWebService.getQuanHuyens(idTinhTP);
            }
            return of([]);
        })
    );

    phuongXa$ = this.form.get('idHuyenNguoiNhan')?.valueChanges.pipe(
        switchMap((idQuan: number) => {
            this.form.get('idXaNguoiNhan')?.setValue(null);
            if (idQuan) {
                return this.courseWebService.getPhuongXas(idQuan);
            }
            return of([]);
        })
    );

    isSubmited = false;

    action = ActionEnum;
    hinhThucNhan = HinhThucNhanEnum;

    private destroyed$ = new Subject();

    constructor(
        private courseWebService: CourseWebService,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService,
        private storageService: StorageService,
        private modalRef: NzModalRef,
        private translocoService: TranslocoService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.form
            .get('idHinhThuc')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.form.get('soDienThoai')?.setValue('');
                this.form.get('hoTen')?.setValue('');
                this.form.get('soNhaNguoiNhan')?.setValue('');
                this.form.get('idTinhNguoiNhan')?.setValue(null);
                this.form.get('idHuyenNguoiNhan')?.setValue(null);
                this.form.get('idXaNguoiNhan')?.setValue(null);
                this.isCopy = false;
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    changeDefaultInfo(isCopy: boolean): void {
        this.isCopy = isCopy;
        this.setDefaultInfo();
    }

    setDefaultInfo(): void {
        const studentInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
        if (studentInfo) {
            if (this.isCopy) {
                this.form.get('idTinhNguoiNhan')?.setValue(studentInfo.idTinhTPLienLac);
                this.form.get('idHuyenNguoiNhan')?.setValue(studentInfo.idQuanHuyenLienLac);
                this.form.get('idXaNguoiNhan')?.setValue(studentInfo.idPhuongXaLienLac);
                this.form.get('soDienThoai')?.setValue(studentInfo.soDienThoai);
                this.form.get('hoTen')?.setValue(studentInfo.hoTen);
                this.form.get('soNhaNguoiNhan')?.setValue(studentInfo.soNhaLienLac);
            }
        }
    }

    closeForm(result = false): void {
        this.modalRef.close(result);
    }

    onSubmit(): void {
        this.clearValidator();
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.onSave();
        }
    }

    onSave(): void {
        this.isSubmited = true;
        switch (this._formState.action) {
            case ActionEnum.CREATE:
                this.courseWebService
                    .post(CourseWebConstant.HINH_THUC_NHAN_BANG, this.form.value, true)
                    .pipe(
                        finalize(() => {
                            this.isSubmited = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(() => {
                        this.notificationService.showSuccessMessage(this.translocoService.translate('DANG_KY_HT_NHAN_VAN_BANG_SUCCESS'));
                        this.closeForm(true);
                    });
                break;
            case ActionEnum.UPDATE:
                this.courseWebService
                    .put(CourseWebConstant.HINH_THUC_NHAN_BANG, this.form.value, true)
                    .pipe(
                        finalize(() => {
                            this.isSubmited = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(() => {
                        this.notificationService.showSuccessMessage(this.translocoService.translate('CAP_NHAT_HT_NHAN_VAN_BANG_SUCCESS'));
                        this.closeForm(true);
                    });
                break;
        }
    }

    mauGiayUyQuyen(idHinhThuc: number): void {
        this.spinner.show();
        this.cdr.detectChanges();
        if (idHinhThuc === HinhThucNhanEnum.TRUC_TIEP) {
            this.courseWebService
                .onExportData(CourseWebConstant.REPORTS + '/InGiayUyQuyen', {
                    idDangKyKhoaHoc: this.form.get('idHocVienDangKy')?.value,
                })
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        } else {
            if (this.form.get('idVanBang')?.value) {
                const data = {
                    ids: [this.form.get('idVanBang')?.value],
                    code: 'COURSE024',
                    isExportPdf: false,
                };
            } else {
                this.notificationService.showWarningMessage(this.translocoService.translate('VAN_BAN_CHUA_DUOC_CAP'));
            }
        }
    }

    private clearValidator(): void {
        if (this.form.get('idHinhThuc')?.value === HinhThucNhanEnum.TRUC_TIEP) {
            this.form.get('idTinhNguoiNhan')?.clearValidators();
            this.form.get('idTinhNguoiNhan')?.setValue(null);
            this.form.get('idHuyenNguoiNhan')?.clearValidators();
            this.form.get('idHuyenNguoiNhan')?.setValue(null);
            this.form.get('idXaNguoiNhan')?.clearValidators();
            this.form.get('idXaNguoiNhan')?.setValue(null);
            this.form.get('soDienThoai')?.clearValidators();
            this.form.get('soDienThoai')?.setValue(null);
            this.form.get('hoTen')?.clearValidators();
            this.form.get('hoTen')?.setValue(null);
            this.form.get('soNhaNguoiNhan')?.clearValidators();
            this.form.get('soNhaNguoiNhan')?.setValue(null);
        }
    }
}
