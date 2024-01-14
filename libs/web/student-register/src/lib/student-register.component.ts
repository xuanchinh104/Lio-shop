import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { finalize, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import {
    CustomEmailValidator,
    DateUtil,
    IdCardNumberValidator,
    PhoneNumberValidator,
    TaxCodeValidator,
    validateAllFormFields,
} from '@asc/shared/utils';
import { NotificationService } from '@asc/shared/services/common';
import { GioiTinhEnum, LoaiDoiTuongDescription, LoaiDoiTuongEnum, LoaiDoiTuongList } from '@asc/shared/data-access';
import { HocVien } from '@asc/web/shell/data-access/models';
import { TranslocoService } from '@ngneat/transloco';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalErrorComponent } from '@asc/web/shared/ui/modal-error';

@Component({
    selector: 'asc-student-register',
    templateUrl: './student-register.component.html',
    styleUrls: ['./student-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentRegisterComponent implements OnInit, OnDestroy {
    @ViewChild('ipMaDoiTuong') ipMaDoiTuong?: ElementRef;
    @ViewChild('fileInputAnhThe') fileInputAnhThe?: ElementRef | null;
    form = this.formBuilder.group({
        hoDem: ['', Validators.required],
        ten: ['', Validators.required],
        avatar: [''],
        idGioiTinh: [1],
        ngaySinh: ['', Validators.required],
        email: ['', [Validators.required, CustomEmailValidator]],
        soDienThoai: ['', [Validators.required, PhoneNumberValidator]],
        soCMND: ['', [Validators.required, IdCardNumberValidator]],
        ngayCapCMND: ['', Validators.required],
        idTinhTPNoiCapCMND: [null],
        idTinhTPNoiSinh: [null, Validators.required],
        coQuanCongTac: ['', Validators.required],
        maSoThueCoQuan: ['', Validators.required],
        diaChiCoQuan: ['', Validators.required],
        emailCoQuan: ['', [Validators.required, CustomEmailValidator]],
        idQuocGiaCoQuan: [null],
        idTinhTPCoQuan: [null],
        isXuatHDCoQuan: [false],
        idTinhTPLienLac: [null, Validators.required],
        idQuanHuyenLienLac: [null, Validators.required],
        idPhuongXaLienLac: [null, Validators.required],
        soNhaLienLac: ['', Validators.required],
        loaiDoiTuong: [null, Validators.required],
        idDanToc: [null],
        idTinhThuongTru: [null, Validators.required],
        idHuyenThuongTru: [null, Validators.required],
        idXaThuongTru: [null, Validators.required],
        soNhaThuongTru: ['', Validators.required],
        maDoiTuong: [
            {
                value: '',
                disabled: true,
            },
            [Validators.required],
        ],
        anhTheUrl: [''],
        ghiChu: [''],
        isConfirmInfo: [false],
        tenAnhThe: [''],
        idTonGiao: [null],
        idQuocTich: [null],
        captCha: [null],
    });

    isSubmited = false;
    loaiDoiTuongEnum = LoaiDoiTuongEnum;
    loaiDoiTuongDescription = LoaiDoiTuongDescription;
    loaiDoiTuongList = LoaiDoiTuongList;

    gioiTinhEnum = GioiTinhEnum;

    isNotification = false;
    infoHocVien!: HocVien;

    mediaServer = this.env.mediaServer;

    quocTichs$ = this.courseWebService.getQuocGias().pipe(shareReplay(1));

    quocGiaCoQuans$ = this.courseWebService.getQuocGias().pipe(shareReplay(1));

    tinhThanhCoQuans$ = this.courseWebService.getTinhThanhs().pipe(shareReplay(1));

    tonGiaos$ = this.courseWebService.getTonGiao().pipe(shareReplay(1));

    tinhThanhLL$ = this.courseWebService.getTinhThanhs().pipe(shareReplay(1));

    qHuyenLL$ = this.form.get('idTinhTPLienLac')?.valueChanges.pipe(
        switchMap((idTinhTP: number) => {
            this.form.get('idQuanHuyenLienLac')?.setValue(null);
            this.form.get('idPhuongXaLienLac')?.setValue(null);
            if (idTinhTP) {
                return this.courseWebService.getQuanHuyens(idTinhTP);
            }
            return of([]);
        })
    );

    phuongXaLL$ = this.form.get('idQuanHuyenLienLac')?.valueChanges.pipe(
        switchMap((idQuan: number) => {
            this.form.get('idPhuongXaLienLac')?.setValue(null);
            if (idQuan) {
                return this.courseWebService.getPhuongXas(idQuan);
            }
            return of([]);
        })
    );

    tinhThanhTT$ = this.courseWebService.getTinhThanhs().pipe(shareReplay(1));

    qHuyenTT$ = this.form.get('idTinhThuongTru')?.valueChanges.pipe(
        switchMap((idTinhTP: number) => {
            this.form.get('idHuyenThuongTru')?.setValue(null);
            this.form.get('idXaThuongTru')?.setValue(null);
            if (idTinhTP) {
                return this.courseWebService.getQuanHuyens(idTinhTP);
            }
            return of([]);
        })
    );

    phuongXaTT$ = this.form.get('idHuyenThuongTru')?.valueChanges.pipe(
        switchMap((idQuan: number) => {
            this.form.get('idXaThuongTru')?.setValue(null);
            if (idQuan) {
                return this.courseWebService.getPhuongXas(idQuan);
            }
            return of([]);
        })
    );

    danToc$ = this.courseWebService.getDanTocs();
    generatedCaptcha!: string;

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private formBuilder: FormBuilder,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService,
        private modal: NzModalService
    ) {}

    get isConfirmInfo(): boolean {
        return !this.form.get('isConfirmInfo')?.value || !this.form.get('captCha')?.value;
    }

    ngOnInit(): void {
        this.generateRandomCaptcha();
        this.form
            .get('isXuatHDCoQuan')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe(isXuatHDCoQuan => {
                if (isXuatHDCoQuan) {
                    this.form.get('coQuanCongTac')?.setValidators([Validators.required]);
                    this.form.get('coQuanCongTac')?.updateValueAndValidity();
                    this.form.get('maSoThueCoQuan')?.setValidators([Validators.required, TaxCodeValidator]);
                    this.form.get('maSoThueCoQuan')?.updateValueAndValidity();
                    this.form.get('diaChiCoQuan')?.setValidators([Validators.required]);
                    this.form.get('diaChiCoQuan')?.updateValueAndValidity();
                    this.form.get('emailCoQuan')?.setValidators([Validators.required, CustomEmailValidator]);
                    this.form.get('emailCoQuan')?.updateValueAndValidity();
                    this.form.get('idQuocGiaCoQuan')?.setValidators([Validators.required]);
                    this.form.get('idQuocGiaCoQuan')?.updateValueAndValidity();
                    this.form.get('idTinhTPCoQuan')?.setValidators([Validators.required]);
                    this.form.get('idTinhTPCoQuan')?.updateValueAndValidity();
                } else {
                    this.form.get('coQuanCongTac')?.clearValidators();
                    this.form.get('coQuanCongTac')?.setValue(null);
                    this.form.get('maSoThueCoQuan')?.clearValidators();
                    this.form.get('maSoThueCoQuan')?.setValue(null);
                    this.form.get('diaChiCoQuan')?.clearValidators();
                    this.form.get('diaChiCoQuan')?.setValue(null);
                    this.form.get('emailCoQuan')?.clearValidators();
                    this.form.get('emailCoQuan')?.setValue(null);
                    this.form.get('idTinhTPCoQuan')?.clearValidators();
                    this.form.get('idTinhTPCoQuan')?.setValue(null);
                    this.form.get('idQuocGiaCoQuan')?.clearValidators();
                    this.form.get('idQuocGiaCoQuan')?.setValue(null);
                }
            });

        this.form
            .get('loaiDoiTuong')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe(loaiDoiTuong => {
                this.form.get('anhTheUrl')?.setValue('');
                this.form.get('tenAnhThe')?.setValue('');
                if (this.ipMaDoiTuong) {
                    if (!loaiDoiTuong) {
                        this.form.get('maDoiTuong')?.setValue('');
                        this.form.get('maDoiTuong')?.disable();
                        this.ipMaDoiTuong.nativeElement.placeholder = '';
                    }

                    if (loaiDoiTuong === this.loaiDoiTuongEnum.CBNV) {
                        this.form.get('maDoiTuong')?.enable();
                        this.form.get('maDoiTuong')?.setValidators([Validators.required]);
                        this.form.get('maDoiTuong')?.updateValueAndValidity();
                        this.ipMaDoiTuong.nativeElement.placeholder = this.translocoService.translate('NHAP_MA_CBNV');
                    }

                    if (loaiDoiTuong === this.loaiDoiTuongEnum.SINH_VIEN) {
                        this.form.get('maDoiTuong')?.enable();
                        this.form.get('maDoiTuong')?.setValidators([Validators.required]);
                        this.form.get('maDoiTuong')?.updateValueAndValidity();
                        this.form.get('emailTruong')?.clearValidators();
                        this.form.get('emailTruong')?.setValue(null);
                        this.ipMaDoiTuong.nativeElement.placeholder = this.translocoService.translate('NHAP_MA_SINH_VIEN');
                    }
                    if (loaiDoiTuong === this.loaiDoiTuongEnum.KHAC) {
                        this.form.get('maDoiTuong')?.enable();
                        this.form.get('maDoiTuong')?.clearValidators();
                        this.form.get('maDoiTuong')?.setValue('');
                        this.form.get('emailTruong')?.clearValidators();
                        this.form.get('emailTruong')?.setValue(null);
                        this.ipMaDoiTuong.nativeElement.placeholder = '';
                    }
                    this.cdr.detectChanges();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    generateRandomCaptcha(): void {
        // Generate a random alphanumeric string with a length of 4
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            captcha += characters.charAt(randomIndex);
        }
        this.generatedCaptcha = captcha;
    }

    getAvatar(avatar: string): void {
        this.form.get('avatar')?.setValue(avatar);
    }

    getTenAnhThe(tenAnhThe: string): void {
        this.form.get('tenAnhThe')?.setValue(tenAnhThe);
    }

    onSubmit(): void {
        if (!this.form.get('isXuatHDCoQuan')?.value) {
            this.form.get('coQuanCongTac')?.clearValidators();
            this.form.get('coQuanCongTac')?.setValue('');
            this.form.get('maSoThueCoQuan')?.clearValidators();
            this.form.get('maSoThueCoQuan')?.setValue('');
            this.form.get('diaChiCoQuan')?.clearValidators();
            this.form.get('diaChiCoQuan')?.setValue('');
            this.form.get('emailCoQuan')?.clearValidators();
            this.form.get('emailCoQuan')?.setValue(null);
            this.form.get('idTinhTPCoQuan')?.clearValidators();
            this.form.get('idTinhTPCoQuan')?.setValue(null);
            this.form.get('idQuocGiaCoQuan')?.clearValidators();
            this.form.get('idQuocGiaCoQuan')?.setValue(null);
        }

        this.form.get('ngaySinh')?.setValue(DateUtil.getFullDate(this.form.get('ngaySinh')?.value));
        this.form.get('ngayCapCMND')?.setValue(DateUtil.getFullDate(this.form.get('ngayCapCMND')?.value));

        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            if (this.form.get('avatar')?.value) {
                if (this.form.get('loaiDoiTuong')?.value !== LoaiDoiTuongEnum.KHAC) {
                    if (this.form.get('anhTheUrl')?.value) {
                        this.onSave();
                    } else {
                        this.notification.showWarningMessage(this.translocoService.translate('WARNING_UPLOAD_ANH_THE'));
                    }
                } else {
                    this.form.get('anhTheUrl')?.setValue('');
                    this.onSave();
                }
            } else {
                this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING2'));
            }
        }
    }

    resetForm(): void {
        this.form.reset();
        this.form.get('idGioiTinh')?.setValue(1);
        this.form.get('isXuatHDCoQuan')?.setValue(false);
        this.generateRandomCaptcha();
    }

    closeNotification(event: boolean): void {
        this.isNotification = event;
        this.form.reset();
        this.generateRandomCaptcha();
    }

    changeAnhThe(event: string): void {
        this.form.get('anhTheUrl')?.setValue(event);
    }

    private onSave(): void {
        if (this.form.get('captCha')?.value === this.generatedCaptcha) {
            this.isSubmited = true;
            this.courseWebService
                .registerStudent(this.form.value)
                .pipe(
                    finalize(() => {
                        this.isSubmited = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(
                    (res: HocVien) => {
                        this.isNotification = true;
                        this.infoHocVien = res;
                        this.generateRandomCaptcha();
                        this.cdr.detectChanges();
                    },
                    error => {
                        this.generateRandomCaptcha();
                        if (error && error.error.errorMessages[0].errorCode === 'HocVienErrorCode17') {
                            this.modal.create({
                                nzContent: ModalErrorComponent,
                                nzComponentParams: {
                                    errorText: error.error.errorMessages[0].errorMessage,
                                },
                                nzWidth: 770,
                                nzFooter: null,
                                nzMaskClosable: false,
                                nzCloseIcon: '',
                                nzClosable: false,
                            });
                        }
                    }
                );
        } else {
            this.notification.showWarningMessage('Mã xác thực không chính xác. Vui lòng kiểm tra lại !');
            this.generateRandomCaptcha();
        }
    }
}
