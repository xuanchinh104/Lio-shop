import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CourseWebService, PaymentService } from '@asc/web/shell/data-access/service';
import { finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Bank, HocVien, LopHocRegistered, MetaInitPay, PaymentInitRequest } from '@asc/web/shell/data-access/models';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@asc/shared/services/common';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { NumberValidator, SafeAny, validateAllFormFields } from '@asc/shared/utils';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '@asc/shared/services/storage';
import { CourseWebConfig, CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { InitPayQRCodeComponent } from './init-pay-qr-code/init-pay-qr-code.component';

interface MapData {
    id: number;
    children: LopHocRegistered[];
    isChecked?: boolean;
}

@Component({
    selector: 'asc-payment-list',
    templateUrl: './payment-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent implements OnDestroy, OnInit {
    form = this.formBuilder.group({
        coQuanCongTac: ['', Validators.required],
        maSoThueCoQuan: ['', [Validators.required, NumberValidator]],
        diaChiCoQuan: ['', Validators.required],
    });

    taiKhoanThanhToans$ = this.courseWebService.getTaiKhoanThanhToans();

    courseRegisters: MapData[] = [];
    trigger$ = new BehaviorSubject<boolean>(false);

    idTaiKhoanThanhToan$ = new BehaviorSubject<number>(0);

    state$ = combineLatest([this.trigger$, this.idTaiKhoanThanhToan$]).pipe(shareReplay());

    request$ = this.state$.pipe(
        switchMap(([isRefresh, idTaiKhoan]) => {
            if (idTaiKhoan) {
                return this.paymentService.getMyCoursePayment(idTaiKhoan).pipe(
                    map((courses: LopHocRegistered[]) => {
                        courses.forEach(m => (m.isChecked = true));
                        return this.mapData(courses);
                    }),
                    tap(res => {
                        const filterIsChecked = res.filter(x => x.isChecked);
                        this.getTotalCourse(filterIsChecked);
                    }),
                    shareReplay()
                );
            }
            return of([]);
        })
    );

    course$ = this.request$.pipe(shareReplay());

    bankSelected: Bank | null = null;
    isLoading = false;

    isLoadingQRCode = false;

    idTaiKhoanThanhToan!: number;
    isXuatHoaDon!: boolean;

    isUserInfo = false;

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private cdr: ChangeDetectorRef,
        private courseWebService: CourseWebService,
        private paymentService: PaymentService,
        private modal: NzModalService,
        private notification: NotificationService,
        private router: Router,
        private translocoService: TranslocoService,
        private formBuilder: FormBuilder,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        const userInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
        if (userInfo) {
            this.form.get('coQuanCongTac')?.setValue(userInfo.coQuanCongTac);
            this.form.get('maSoThueCoQuan')?.setValue(userInfo.maSoThueCoQuan);
            this.form.get('diaChiCoQuan')?.setValue(userInfo.diaChiCoQuan);
        }
        this.isUserInfo = !!(userInfo.maSoThueCoQuan && userInfo.diaChiCoQuan && userInfo.coQuanCongTac);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    get isCheckAll(): boolean {
        return this.courseRegisters.filter(m => m.isChecked).length === this.courseRegisters.length;
    }

    get isDisable(): boolean {
        const children = this.courseRegisters.map(x => x.children).reduce((result, arr) => result.concat(arr), []);
        return children.filter(m => m.isChecked).length <= 0 || !this.bankSelected || this.isLoading;
    }

    changeXuatHoaDon(isXuatHoaDon: boolean): void {
        if (isXuatHoaDon) {
            this.form.get('coQuanCongTac')?.setValidators([Validators.required]);
            this.form.get('coQuanCongTac')?.updateValueAndValidity();
            this.form.get('maSoThueCoQuan')?.setValidators([Validators.required]);
            this.form.get('maSoThueCoQuan')?.updateValueAndValidity();
            this.form.get('diaChiCoQuan')?.setValidators([Validators.required]);
            this.form.get('diaChiCoQuan')?.updateValueAndValidity();
        } else {
            this.form.get('coQuanCongTac')?.clearValidators();
            this.form.get('maSoThueCoQuan')?.clearValidators();
            this.form.get('diaChiCoQuan')?.clearValidators();
        }
    }

    removeCourse(item: MapData): void {
        const course = item.children as LopHocRegistered[];
        const data = {
            ids: course.map(x => x.id),
        };
        this.modal.confirm({
            nzTitle: this.translocoService.translate('TITLE_MODAL1'),
            nzClassName: 'custom-confirm-modal',
            nzContent: this.translocoService.translate('CONTENT_MODAL2'),
            nzOkText: this.translocoService.translate('TEXT_CONFIRM1'),
            nzOkDanger: true,
            nzOnOk: () => {
                this.paymentService
                    .deleteCoursePayment(data)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(() => {
                        this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                        this.removeHandle(item.id);
                        this.courseRegisters = [];
                        this.trigger$.next(true);
                        this.cdr.detectChanges();
                    });
            },
            nzCancelText: this.translocoService.translate('TEXT_CANCEL_MODAL'),
        });
    }

    trackByFunc(index: number): number {
        return index;
    }

    goBack(): void {
        this.router.navigate(['/profile/course-registered']);
    }

    onChange(isChecked: boolean): void {
        this.courseRegisters.forEach(x => {
            x.isChecked = isChecked;
            this.cdr.detectChanges();
        });
        // this.trigger$.next(true);
    }

    onChangeCheckedItem(e: boolean, index: number): void {
        this.courseRegisters[index].isChecked = e;

        const filterIsChecked = this.courseRegisters.filter(x => x.isChecked);
        this.getTotalCourse(filterIsChecked);
    }

    initPay(isQRCode: boolean): void {
        this.getInitPay(isQRCode);
    }

    onSelectBank(bank: Bank | null): void {
        if (bank) {
            this.bankSelected = bank;
        }
    }

    changeTaiKhoanThanhToan(idTaiKhoan: number): void {
        this.idTaiKhoanThanhToan = idTaiKhoan;
        this.idTaiKhoanThanhToan$.next(idTaiKhoan);
        this.bankSelected = null;
    }

    getTotalCourse(courseRegisters: MapData[]): number {
        const filterIsChecked = courseRegisters.filter(x => x.isChecked);
        const newArr = filterIsChecked.filter(item => item.isChecked).map(x => x.children);
        const children = newArr.reduce((result, arr) => result.concat(arr), []);
        return children
            .filter(m => m.isChecked)
            .reduce((accumulator, object) => {
                if (object.congNo > 0) {
                    return accumulator + object.congNo;
                }
                return accumulator + (object.isMienGiam ? object.hocPhiPhaiNop : object.hocPhiDangKy);
            }, 0);
    }

    private getInitPay(isQRCode: boolean): void {
        if (!this.isXuatHoaDon) {
            this.form.get('coQuanCongTac')?.clearValidators();
            this.form.get('coQuanCongTac')?.setValue(null);
            this.form.get('maSoThueCoQuan')?.clearValidators();
            this.form.get('maSoThueCoQuan')?.setValue(null);
            this.form.get('diaChiCoQuan')?.clearValidators();
            this.form.get('diaChiCoQuan')?.setValue(null);
        }
        if (!this.bankSelected) {
            this.notification.showWarningMessage(this.translocoService.translate('TEXT_WARNING1'));
        } else {
            if (this.form.invalid) {
                validateAllFormFields(this.form);
            } else {
                if (isQRCode) {
                    this.isLoadingQRCode = true;
                } else {
                    this.isLoading = true;
                }
                const newArr = this.courseRegisters.filter(item => item.isChecked).map(x => x.children);
                const children = newArr.reduce((result, arr) => result.concat(arr), []);
                this.course$
                    .pipe(
                        switchMap(rs => {
                            const metaInitPay = {
                                isToken: null,
                                channel: null,
                                idLoaiHinhThanhToan: isQRCode ? 5 : null,
                                ipAddress: '',
                                transactionMethod: null,
                                idLoaiThu: null,
                                isQRTinh: null,
                                thongTinThiSinhBoSung: '',
                            } as MetaInitPay;

                            const request: PaymentInitRequest = {
                                bank: {
                                    id: this.bankSelected?.id ?? 0,
                                    maNganHang: this.bankSelected?.maNganHang ?? '',
                                    tenNganHang: this.bankSelected?.tenNganHang ?? '',
                                    strRequest01: '',
                                    strRequest02: '',
                                    strRequest03: '',
                                    metaData: '',
                                },
                                courses: children.map(item => {
                                    if (item.congNo > 0) {
                                        return {
                                            id: item.id,
                                            maDangKy: item.maDangKy,
                                            idKhoaHoc: item.idKhoaHoc,
                                            idLopHoc: item.idLopHoc,
                                            tenKhoaHoc: item.tenKhoaHoc,
                                            hocPhi: item.congNo,
                                            alias: item.alias,
                                            metaData: '',
                                        };
                                    }
                                    return {
                                        id: item.id,
                                        maDangKy: item.maDangKy,
                                        idKhoaHoc: item.idKhoaHoc,
                                        idLopHoc: item.idLopHoc,
                                        tenKhoaHoc: item.tenKhoaHoc,
                                        hocPhi: item.isMienGiam ? item.hocPhiPhaiNop : item.hocPhiDangKy,
                                        alias: item.alias,
                                        metaData: '',
                                    };
                                }),
                                idTaiKhoanThanhToan: this.idTaiKhoanThanhToan,
                                isXuatHoaDon: this.isXuatHoaDon ? true : false,
                                metaInitPay,
                            };
                            const userInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
                            if (this.isXuatHoaDon) {
                                const data = {
                                    maHocVien: userInfo.maHocVien,
                                    ...this.form.value,
                                    isXuatHoaDonCoQuan: true,
                                };
                                return this.updateUserInfo(data).pipe(switchMap(() => this.paymentService.initPayment(request)));
                            } else {
                                return this.paymentService.initPayment(request);
                            }
                        }),
                        finalize(() => {
                            this.isLoading = false;
                            this.isLoadingQRCode = false;
                            this.cdr.detectChanges();
                        }),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(rs => {
                        if (isQRCode) {
                            const modal = this.modal.create({
                                nzContent: InitPayQRCodeComponent,
                                nzComponentParams: {
                                    dataQRCode: rs.metaData,
                                },
                                nzWrapClassName: 'qr-code',
                                nzWidth: 700,
                                nzFooter: null,
                                nzMaskClosable: false,
                                nzCloseIcon: '',
                                nzClosable: false,
                            });
                            modal.afterClose.subscribe((isLoad: boolean) => {
                                if (isLoad) {
                                    this.router.navigate(['/profile/course-registered']);
                                }
                                this.isLoadingQRCode = false;
                                this.cdr.detectChanges();
                            });
                        } else {
                            window.location.assign(rs.url);
                        }
                    });
            }
        }
    }

    private updateUserInfo(data: SafeAny): Observable<SafeAny> {
        return this.courseWebService.put(CourseWebConstant.COMMON_FOR_WEB + '/UpdateInfoHDDT', {
            ...data,
        });
    }

    private removeHandle(id: number): void {
        const idx = this.courseRegisters.findIndex(course => course.id === id);
        if (idx > -1) {
            this.courseRegisters.splice(idx, 1);
        }
    }

    private mapData(data: LopHocRegistered[]): MapData[] {
        this.courseRegisters = [];
        const groupedArray: { [id: number]: SafeAny[] } = {};
        data.forEach(item => {
            if (item.idLoaiMienGiam === 2) {
                const itemId = item.idMienGiam ? item.idMienGiam : item.id;
                if (groupedArray[itemId]) {
                    groupedArray[itemId].push(item);
                } else {
                    groupedArray[itemId] = [item];
                }
            } else {
                const resultItem = {
                    id: item.id,
                    children: [item],
                    isChecked: item.isChecked,
                } as MapData;
                this.courseRegisters.push(resultItem);
            }
        });
        // eslint-disable-next-line guard-for-in
        for (const itemId in groupedArray) {
            const group = groupedArray[itemId] as LopHocRegistered[];
            const isChecked = group[0]?.isChecked;
            const resultItem = {
                id: Number(itemId),
                children: group as LopHocRegistered[],
                isChecked,
            } as MapData;
            this.courseRegisters.push(resultItem);
        }
        return this.courseRegisters;
    }
}
