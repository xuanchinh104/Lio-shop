import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GioiTinhEnum, LoaiDoiTuongDescription, LoaiDoiTuongEnum, LoaiDoiTuongList } from '@asc/shared/data-access';
import {
    CustomEmailValidator,
    DateUtil,
    IdCardNumberValidator,
    PhoneNumberValidator,
    TaxCodeValidator,
    validateAllFormFields,
} from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { finalize, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { NotificationService } from '@asc/shared/services/common';
import { HocVien } from '@asc/web/shell/data-access/models';
import { AuthService } from '@asc/core/auth/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewAvatarComponent } from '@asc/features/shell/ui/avatar';
import { TranslocoService } from '@ngneat/transloco';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-student-update',
    templateUrl: './student-update.component.html',
    styleUrls: ['./student-update.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentUpdateComponent implements OnDestroy {
    @ViewChild('ipMaDoiTuong') ipMaDoiTuong?: ElementRef;
    _info: HocVien | null = null;
    form = this.formBuilder.group({
        hoDem: [''],
        ten: [''],
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
        emailCoQuan: ['', Validators.required],
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
        tenAnhThe: [''],
        idTonGiao: [null],
        idQuocTich: [null],
    });

    isSubmited = false;
    isEdit = false;
    loaiDoiTuongEnum = LoaiDoiTuongEnum;
    loaiDoiTuongDescription = LoaiDoiTuongDescription;
    loaiDoiTuongList = LoaiDoiTuongList;
    gioiTinhEnum = GioiTinhEnum;

    studentInfo$ = this.courseWebService.getStudentInfo().pipe(
        tap(rs => {
            setTimeout(() => {
                this._info = rs;
                this.cdr.detectChanges();
            }, 0);
        })
    );

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

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private formBuilder: FormBuilder,
        private notification: NotificationService,
        private auth: AuthService,
        private cdr: ChangeDetectorRef,
        private modal: NzModalService,
        private translocoService: TranslocoService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    editView(): void {
        this.isEdit = !this.isEdit;

        this.studentInfo$.pipe(takeUntil(this.destroyed$)).subscribe(rs => {
            setTimeout(() => {
                this._info = rs;
                this.form.patchValue(rs);
                this.cdr.detectChanges();
            }, 0);
            this.cdr.detectChanges();
        });
    }

    handleMissingImage(event: Event): void {
        (event.target as HTMLImageElement).src = '../assets/images/img/no-avatar.svg';
    }

    changeXuatHoaDon(isXuatHDCoQuan: boolean): void {
        if (isXuatHDCoQuan) {
            this.form.get('coQuanCongTac')?.setValidators([Validators.required]);
            this.form.get('coQuanCongTac')?.updateValueAndValidity();
            this.form.get('maSoThueCoQuan')?.setValidators([Validators.required, TaxCodeValidator]);
            this.form.get('maSoThueCoQuan')?.updateValueAndValidity();
            this.form.get('diaChiCoQuan')?.setValidators([Validators.required]);
            this.form.get('diaChiCoQuan')?.updateValueAndValidity();
            this.form.get('emailCoQuan')?.setValidators([Validators.required, CustomEmailValidator]);
            this.form.get('emailCoQuan')?.updateValueAndValidity();
            this.form.get('idTinhTPCoQuan')?.setValidators([Validators.required]);
            this.form.get('idTinhTPCoQuan')?.updateValueAndValidity();
            this.form.get('idQuocGiaCoQuan')?.setValidators([Validators.required]);
            this.form.get('idQuocGiaCoQuan')?.updateValueAndValidity();
        } else {
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
    }

    changeLoaiDoiTuong(loaiDoiTuong: number): void {
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
    }

    getTenAnhThe(tenAnhThe: string): void {
        this.form.get('tenAnhThe')?.setValue(tenAnhThe);
    }

    getAvatar(avatar: string): void {
        this.form.get('avatar')?.setValue(avatar);
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
            this.form.get('emailCoQuan')?.setValue('');
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
            this.form.get('hoDem')?.setValue(this.formatHoTen(this.form.get('hoDem')?.value));
            this.form.get('ten')?.setValue(this.formatHoTen(this.form.get('ten')?.value));
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
                this.notification.showWarningMessage(this.translocoService.translate('UPLOAD_AVATAR'));
            }
        }
    }

    viewAvatar(): void {
        this.modal.create({
            nzContent: ViewAvatarComponent,
            nzWrapClassName: 'nz-fullbox view-file',
            nzClosable: false,
            nzComponentParams: {
                avatar: this._info?.avatar,
            },
            nzFooter: null,
            nzMaskClosable: false,
        });
    }

    viewAnhThe(): void {
        this.modal.create({
            nzContent: ViewAvatarComponent,
            nzWrapClassName: 'nz-fullbox view-file',
            nzClosable: false,
            nzComponentParams: {
                avatar: this.form.get('anhTheUrl')?.value ? this.form.get('anhTheUrl')?.value : this._info?.anhTheUrl,
            },
            nzFooter: null,
            nzMaskClosable: false,
        });
    }

    changeAnhThe(event: string): void {
        this.form.get('anhTheUrl')?.setValue(event);
    }

    private formatHoTen(keyword: string): string {
        const words = keyword.toLowerCase().split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        return words.join(' ');
    }

    private onSave(): void {
        this.isSubmited = true;
        this.courseWebService
            .updateStudentInfo(this.form.value)
            .pipe(
                switchMap(() => this.studentInfo$),
                finalize(() => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(
                () => {
                    this.auth.refreshAvatar$.next(true);
                    if (this._info) {
                        this._info.avatar = this.form.get('avatar')?.value ?? '';
                    }
                    this.notification.showSuccessMessage(this.translocoService.translate('MSG_UPDATE_DONE'));
                    this.isEdit = !this.isEdit;
                },
                error => {
                    this.isEdit = true;
                }
            );
    }
}
