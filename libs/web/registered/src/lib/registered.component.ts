import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CartService, CourseWebService } from '@asc/web/shell/data-access/service';
import { NotificationService } from '@asc/shared/services/common';
import {
    CustomEmailValidator,
    DateUtil,
    IdCardNumberValidator,
    PhoneNumberValidator,
    TaxCodeValidator,
    validateAllFormFields,
} from '@asc/shared/utils';
import { finalize, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { GioiTinh, GioiTinhEnum, LoaiDoiTuongDescription, LoaiDoiTuongEnum, LoaiDoiTuongList } from '@asc/shared/data-access';
import { Router } from '@angular/router';
import { LopHoc, UserRegister } from '@asc/web/shell/data-access/models';
import { AuthService } from '@asc/core/auth/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslocoService } from '@ngneat/transloco';
import { ModalErrorComponent } from '@asc/web/shared/ui/modal-error';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-registered',
    templateUrl: './registered.component.html',
    styleUrls: ['./registered.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisteredComponent implements OnInit, OnDestroy {
    @ViewChild('ipMaDoiTuong') ipMaDoiTuong?: ElementRef;
    readonly userInfo$ = this.auth.getUserInfo();

    readonly isLogin$ = this.userInfo$.pipe(map(rs => !!rs));

    form = this.formBuilder.group({
        idHocVien: [null],
        hoDem: ['', Validators.required],
        ten: ['', Validators.required],
        avatar: [''],
        gioiTinh: [true],
        ngaySinh: ['', Validators.required],
        soCMND: ['', [Validators.required, IdCardNumberValidator]],
        ngayCapCMND: ['', Validators.required],
        idTinhTPNoiCapCMND: [null],
        soDienThoai: ['', [Validators.required, PhoneNumberValidator]],
        email: ['', [Validators.required, CustomEmailValidator]],
        idTinhTPNoiSinh: [null, Validators.required],
        coQuanCongTac: ['', Validators.required],
        maSoThueCoQuan: [''],
        diaChiCoQuan: [''],
        emailCoQuan: ['', [Validators.required, CustomEmailValidator]],
        idQuocGiaCoQuan: [null],
        idTinhTPCoQuan: [null, Validators.required],
        isXuatHDCoQuan: [false],
        idTinhTPLienLac: [null],
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

    gioiTinhEnum = GioiTinhEnum;
    gioiTinh = GioiTinh;

    loaiDoiTuongEnum = LoaiDoiTuongEnum;
    loaiDoiTuongDescription = LoaiDoiTuongDescription;
    loaiDoiTuongList = LoaiDoiTuongList;

    isNotification = false;
    selectedCourses: LopHoc[] = [];

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

    userRegister: UserRegister | null = null;

    generatedCaptcha!: string;

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private formBuilder: FormBuilder,
        private notification: NotificationService,
        private modal: NzModalService,
        private auth: AuthService,
        private cartService: CartService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private translocoService: TranslocoService
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
                        this.form.get('emailTruong')?.clearValidators();
                        this.form.get('emailTruong')?.setValue(null);
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

    registerCourse(): void {
        if (this.selectedCourses.length > 0) {
            this.register();
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING3'));
        }
    }

    resetForm(): void {
        this.form.reset();
        this.form.get('isXuatHDCoQuan')?.setValue(false);
        this.form.get('gioiTinh')?.setValue(true);
        this.generateRandomCaptcha();
    }

    closeNotification(event: boolean): void {
        this.isNotification = event;
        this.form.reset();
        this.form.get('isXuatHDCoQuan')?.setValue(false);
        this.form.get('gioiTinh')?.setValue(true);
        this.generateRandomCaptcha();
    }

    getAvatar(avatar: string): void {
        this.form.get('avatar')?.setValue(avatar);
    }

    getTenAnhThe(tenAnhThe: string): void {
        this.form.get('tenAnhThe')?.setValue(tenAnhThe);
    }

    coursesSelected(courses: LopHoc[]): void {
        this.selectedCourses = courses;
    }

    changeAnhThe(event: string): void {
        this.form.get('anhTheUrl')?.setValue(event);
    }

    onBack(): void {
        history.back();
    }

    private register(): void {
        const data = {
            ghiChu: this.form.get('ghiChu')?.value,
            lopHocs: this.selectedCourses.map(x => ({
                id: x.id,
                alias: x.aliasNhom,
                hocPhiPhaiNop: x.hocPhiPhaiNop ? x.hocPhiPhaiNop : x.hocPhi,
                idChiTietMienGiam: x.idChiTietMienGiam,
                maLop: x.maLop,
                tenLop: x.tenLop,
                metaData: x.metaData,
                idXepLoai: x.idXepLoai,
            })),
        };
        this.isSubmited = true;
        this.courseWebService
            .registerLopHoc(data)
            .pipe(
                finalize(() => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(res => {
                this.cartService.resetTotal();
                this.notification.showSuccessMessage(res.message);
                this.router.navigate(['/profile/course-registered']);
            });
    }

    private onSave(): void {
        if (this.selectedCourses.length > 0) {
            if (this.form.get('captCha')?.value === this.generatedCaptcha) {
                const data = {
                    ...this.form.value,
                    lopHocs: this.selectedCourses,
                };
                this.isSubmited = true;
                this.courseWebService
                    .registerLopHocFirst(data)
                    .pipe(
                        finalize(() => {
                            this.isSubmited = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(
                        rs => {
                            this.cartService.resetTotal();
                            this.isNotification = true;
                            this.userRegister = rs;
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
        } else {
            this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING3'));
        }
    }

    private checkIdXepLoaiValidity(arrs: LopHoc[]): boolean {
        return arrs.every(item => item.isXepLoai === true && item.idXepLoai !== null);
    }
}
