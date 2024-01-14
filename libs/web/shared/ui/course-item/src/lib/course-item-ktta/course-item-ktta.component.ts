import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HocVien, LopHoc, LopHocDaMo, LopHocSeleted } from '@asc/web/shell/data-access/models';
import { interval, Subject, Subscription } from 'rxjs';
import { StorageService } from '@asc/shared/services/storage';
import { CartService } from '@asc/web/shell/data-access/service';
import { AuthService } from '@asc/core/auth/services';
import { NotificationService } from '@asc/shared/services/common';
import { Router } from '@angular/router';
import { SafeAny, SecurityUtil } from '@asc/shared/utils';
import { CourseWebConfig } from '@asc/web/shell/data-access/constant';

@Component({
    selector: 'asc-course-item-ktta',
    templateUrl: './course-item-ktta.component.html',
    styleUrls: ['./course-item-ktta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseItemKttaComponent implements OnInit, OnDestroy {
    readonly userInfo$ = this.auth.getUserInfo();

    @Input() viewStyle = 'list';
    @Input() lopHocDaMo!: LopHocDaMo;
    @Input() item?: LopHoc;
    @Input() alias?: string;

    countDown = '';
    countdownSubscription!: Subscription;

    isDate = false;

    seconds!: string;
    minutes!: string;
    hours!: string;
    days!: string;

    private destroyed$ = new Subject();

    constructor(
        private storageService: StorageService,
        private cartService: CartService,
        private auth: AuthService,
        private notification: NotificationService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (this.lopHocDaMo && (this.lopHocDaMo.thoiGianBatDauDangKy || this.lopHocDaMo.thoiGianKetThucDangKy)) {
            this.updateCountdown();
            const newDate = new Date();
            newDate.setHours(0, 0, 0, 0);
            const ngayBatDau = new Date(this.lopHocDaMo.thoiGianBatDauDangKy);
            this.isDate = ngayBatDau.getTime() <= newDate.getTime();
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    addToCart(item: SafeAny): void {
        const thoiGianKetThucDangKy = new Date(item.thoiGianKetThucDangKy);
        const thoiGianBatDauDangKy = new Date(item.thoiGianBatDauDangKy);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (item.thoiGianBatDauDangKy && currentDate < thoiGianBatDauDangKy) {
            this.notification.showWarningMessage('Lớp học chưa đến thời gian đăng ký !');
        } else if (item.thoiGianKetThucDangKy && currentDate > thoiGianKetThucDangKy) {
            this.notification.showWarningMessage('Lớp học không trong thời gian đăng ký !');
        } else {
            this.checkAddToCard(item);
        }
    }

    onSelectCourse(item: SafeAny): void {
        const thoiGianKetThucDangKy = new Date(item.thoiGianKetThucDangKy);
        const thoiGianBatDauDangKy = new Date(item.thoiGianBatDauDangKy);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (item.thoiGianBatDauDangKy && currentDate < thoiGianBatDauDangKy) {
            this.notification.showWarningMessage('Lớp học chưa đến thời gian đăng ký !');
        } else if (item.thoiGianKetThucDangKy && currentDate > thoiGianKetThucDangKy) {
            this.notification.showWarningMessage('Lớp học không trong thời gian đăng ký !');
        } else {
            this.checkRegisterClass(item);
        }
    }

    copyLink(item: SafeAny): void {
        const encodedLink = encodeURIComponent(item.tenLop);
        const currentUrl = window.location.origin;
        const keywordParam = '/search?keyword=';
        const linkToCopy = currentUrl + keywordParam + encodedLink;
        const el = document.createElement('textarea');
        el.value = linkToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.notification.showSuccessMessage('Sao chép thành công');
    }

    showInfoLopHoc(item: LopHocDaMo): void {
        const hashNameGroup = SecurityUtil.set(item.tenNhomKhoaHoc);

        if (hashNameGroup) {
            this.router.navigate(['/course-group', hashNameGroup, item.aliasKhoa]);
        }
    }

    updateCountdown(): void {
        this.countdownSubscription = interval(1000).subscribe(() => {
            const currentDate = new Date().getTime();
            const endTime = new Date(this.lopHocDaMo.thoiGianKetThucDangKy);
            endTime.setHours(23, 59, 59);
            const timeDifference = endTime.getTime() - currentDate;

            if (timeDifference > 0) {
                const seconds = Math.floor((timeDifference / 1000) % 60)
                    .toString()
                    .padStart(2, '0');
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
                    .toString()
                    .padStart(2, '0');
                const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
                    .toString()
                    .padStart(2, '0');
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                    .toString()
                    .padStart(2, '0');

                this.days = days;
                this.hours = hours;
                this.minutes = minutes;
                this.seconds = seconds;

                this.countDown = `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`;
                this.cdr.detectChanges();
            } else {
                this.countDown = 'Hết hạn đăng ký';
                this.cdr.detectChanges();
                this.countdownSubscription.unsubscribe();
            }
        });
    }

    private checkAddToCard(item: SafeAny): void {
        const hocVienInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
        if (hocVienInfo) {
            const newItem = Object.assign(
                {
                    aliasNhom: this.alias,
                    idChiTietMienGiam: item.idChiTietMienGiam,
                },
                item
            );
            const selectedCoursed: LopHocSeleted[] | null = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES);
            if (selectedCoursed && selectedCoursed.length > 0) {
                const indexCourse = selectedCoursed.findIndex(course => course.id === newItem.id);
                if (indexCourse < 0) {
                    if (newItem.isMienGiam && newItem.loaiDoiTuong.includes(hocVienInfo.loaiDoiTuong.toString())) {
                        this.router.navigate(['/uu-dai-hoc-phi', item.aliasLop ? item.aliasLop : item.alias]);
                    } else {
                        this.storageService.store(CourseWebConfig.SELECTED_COURSES, [...selectedCoursed, newItem]);
                        this.cartService.updateTotal();
                        this.notification.showSuccessMessage('Thêm lớp học vào giỏ hàng thành công');
                    }
                } else {
                    this.notification.showWarningMessage('Lớp học đã được thêm vào giỏ hàng');
                }
            } else {
                if (newItem.isMienGiam && newItem.loaiDoiTuong.includes(hocVienInfo.loaiDoiTuong.toString())) {
                    this.router.navigate(['/uu-dai-hoc-phi', item.aliasLop ? item.aliasLop : item.alias]);
                } else {
                    this.storageService.store(CourseWebConfig.SELECTED_COURSES, [newItem]);
                    this.cartService.updateTotal();
                    this.notification.showSuccessMessage('Thêm lớp học vào giỏ hàng thành công');
                }
            }
        } else {
            this.router.navigate(['/register']);
        }
    }

    private checkRegisterClass(item: SafeAny): void {
        const hocVienInfo = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO) as HocVien;
        if (hocVienInfo) {
            const newItem = Object.assign(
                {
                    aliasNhom: this.alias,
                    idChiTietMienGiam: item.idChiTietMienGiam,
                },
                item
            );
            const selectedCoursed: LopHocSeleted[] | null = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES);
            if (selectedCoursed && selectedCoursed.length > 0) {
                const indexCourse = selectedCoursed.findIndex(course => course.id === newItem.id);
                if (indexCourse < 0) {
                    if (newItem.isMienGiam && newItem.loaiDoiTuong.includes(hocVienInfo.loaiDoiTuong.toString())) {
                        this.router.navigate(['/uu-dai-hoc-phi', item.aliasLop ? item.aliasLop : item.alias]);
                    } else {
                        this.storageService.store(CourseWebConfig.SELECTED_COURSES, [...selectedCoursed, newItem]);
                        this.router.navigate(['/register-course']);
                        this.cartService.updateTotal();
                    }
                } else {
                    this.router.navigate(['/register-course']);
                }
            } else {
                if (newItem.isMienGiam && newItem.loaiDoiTuong.includes(hocVienInfo.loaiDoiTuong.toString())) {
                    this.router.navigate(['/uu-dai-hoc-phi', item.aliasLop ? item.aliasLop : item.alias]);
                } else {
                    this.storageService.store(CourseWebConfig.SELECTED_COURSES, [newItem]);
                    this.router.navigate(['/register-course']);
                    this.cartService.updateTotal();
                }
            }
        } else {
            this.router.navigate(['/register']);
        }
    }
}
