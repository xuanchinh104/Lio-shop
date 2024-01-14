import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { BehaviorSubject, of } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { PhongBan } from '@asc/features/catalog/data-access';
import { LopHocDaMo } from '@asc/web/shell/data-access/models';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-list-open',
    templateUrl: './course-list-open.component.html',
    styleUrls: ['./course-list-open.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListOpenComponent {
    @Input() set phongBan(val: PhongBan) {
        if (val) {
            this.keyword$.next(val.tenPhongBan);
        }
    }

    listImg = [
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-thach-thao-trang-thanh-tu.jpg.webp',
            ten: 'Hoa hướng dương',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-sunny.jpg.webp',
            ten: 'Hoa thạch thảo trắng',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/niem-mong.jpg.webp',
            ten: 'Hoa hồng kem',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/mot-tinh-yeu.jpg.webp',
            ten: 'Hoa hồng đỏ',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-thach-thao-tim-miracle-2.jpg.webp',
            ten: 'Hoa sen hồng',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-tulip-tim-nguoi-thuong.jpg.webp',
            ten: 'Thạch thảo tím',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-hong-vang-uom-nang.jpg.webp',
            ten: 'Hoa tulip tím',
        },
        {
            img: 'https://8384f55340.vws.vegacdn.vn/image/cache/catalog/products/August%202023/bo-hoa-cam-chuong-nhap-mau-nau.jpg.webp',
            ten: 'Hoa hồng vàng',
        },
    ];

    isLoading$ = new BehaviorSubject<boolean>(true);

    keyword$ = new BehaviorSubject<string>('');

    lopHocs$ = this.keyword$.pipe(
        switchMap(keyword =>
            this.courseService.getLopHocDaMo(8, 1, 'siSoDangKy', keyword).pipe(
                map(res => res.items),
                switchMap((res: LopHocDaMo[]) => {
                    if (res.length > 0) {
                        return of(res);
                    } else {
                        return this.courseService.getLopHocDaMo(8, 1, 'siSoDangKy').pipe(map(m => m.items));
                    }
                }),
                finalize(() => this.isLoading$.next(false))
            )
        )
    );

    lopHocsNew$ = this.keyword$.pipe(
        switchMap(keyword =>
            this.courseService.getLopHocDaMo(8, 1, 'ngayTao', keyword).pipe(
                map(res => res.items),
                switchMap((res: LopHocDaMo[]) => {
                    if (res.length > 0) {
                        return of(res);
                    } else {
                        return this.courseService.getLopHocDaMo(8, 1, 'ngayTao').pipe(map(m => m.items));
                    }
                }),
                finalize(() => this.isLoading$.next(false))
            )
        )
    );

    serviceName = this.env.serviceName;

    serviceNameRHM = this.env.serviceNameRHM;

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseService: CourseWebService,
        private cdr: ChangeDetectorRef
    ) {}

    trackByFunc(index: number): number {
        return index;
    }
}
