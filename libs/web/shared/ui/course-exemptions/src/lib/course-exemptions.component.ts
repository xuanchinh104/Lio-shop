import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService, CourseWebService } from '@asc/web/shell/data-access/service';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ConvertData, MapData, HocVien, LopHoc, ThongTinMienGiam, MapDataCombo } from '@asc/web/shell/data-access/models';
import { StorageService } from '@asc/shared/services/storage';
import { CourseWebConfig, CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { LoaiDoiTuongDescription } from '@asc/shared/data-access';
import { AuthService } from '@asc/core/auth/services';
import { NotificationService } from '@asc/shared/services/common';
import { SafeAny } from '@asc/shared/utils';

@Component({
    selector: 'asc-course-exemptions',
    templateUrl: './course-exemptions.component.html',
    styleUrls: ['./course-exemptions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseExemptionsComponent implements OnInit {
    _info: HocVien | null = null;

    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly trigger$ = this.param$.pipe(shareReplay());

    readonly courses$ = this.trigger$.pipe(
        switchMap(alias => this.getTTMienGiamPaging(alias)),
        shareReplay()
    );

    arrCombo: MapDataCombo[] = [];

    loaiDoiTuong = LoaiDoiTuongDescription;

    isMienGiamDon = false;

    constructor(
        private route: ActivatedRoute,
        private courseWebService: CourseWebService,
        private cdr: ChangeDetectorRef,
        private storageService: StorageService,
        private cartService: CartService,
        private router: Router,
        private auth: AuthService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this._info = this.storageService.retrieve(CourseWebConfig.HOC_VIEN_INFO);
    }

    registerLopHocDon(item: ThongTinMienGiam): void {
        const newItem = Object.assign({
            hocPhiPhaiNop: item.hocPhiPhaiNop,
            id: item.idLopHoc,
            idCombo: item.id,
            hocPhi: item.hocPhi,
            tenLop: item.tenLop,
            ngayBatDau: item.ngayBatDau,
            ngayKetThuc: item.ngayKetThuc,
            idChiTietMienGiam: item.idChiTietMienGiam,
            maLop: item.maLop,
            idLoaiMienGiam: item.idLoaiMienGiam,
            isXepLoai: item.isXepLoai,
        });
        const arr = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES) as LopHoc[];
        if (arr && arr.length > 0) {
            const indexCourse = arr.findIndex(course => course.id === newItem.id);
            if (indexCourse < 0) {
                this.storageService.store(CourseWebConfig.SELECTED_COURSES, [...arr, newItem]);
                this.cartService.updateTotal();
                this.router.navigate(['/register-course']);
            } else {
                this.notification.showWarningMessage('Lớp học đã được thêm vào giỏ hàng');
            }
        } else {
            this.storageService.store(CourseWebConfig.SELECTED_COURSES, [newItem]);
            this.cartService.updateTotal();
            this.router.navigate(['/register-course']);
        }
    }

    registerLopHocComBo(item: MapData): void {
        const combo = item.children.map(x => ({
            ...x,
            id: x.idLopHoc,
            idCombo: x.id,
            idChiTietMienGiam: x.idChiTietMienGiam,
            aliasNhom: '',
            maLop: x.maLop,
            idLoaiMienGiam: x.idLoaiMienGiam,
        }));
        let arrCourseSelected = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES) as SafeAny[];

        if (arrCourseSelected && arrCourseSelected.length > 0) {
            const hasCommonId = combo.some(item1 => arrCourseSelected.some(item2 => item2.id === item1.id));
            if (hasCommonId) {
                this.notification.showWarningMessage('Lớp học đã có trong giỏ hàng. Vui lòng xóa lớp học trước khi đăng ký ưu đãi combo !');
            } else {
                arrCourseSelected = [...arrCourseSelected, ...combo];
                this.storageService.store(CourseWebConfig.SELECTED_COURSES, arrCourseSelected);
                this.cartService.updateTotal();
                this.router.navigate(['/register-course']);
            }
        } else {
            this.storageService.store(CourseWebConfig.SELECTED_COURSES, combo);
            this.cartService.updateTotal();
            this.router.navigate(['/register-course']);
        }
    }

    addToCart(item: MapData): void {
        const combo = item.children.map(x => ({
            ...x,
            id: x.idLopHoc,
            idCombo: x.id,
            aliasNhom: '',
            maLop: x.maLop,
            idLoaiMienGiam: x.idLoaiMienGiam,
        }));
        let arrCourseSelected = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES) as SafeAny[];

        if (arrCourseSelected && arrCourseSelected.length > 0) {
            const hasCommonId = combo.some(item1 => arrCourseSelected.some(item2 => item2.id === item1.id));
            if (hasCommonId) {
                this.notification.showWarningMessage('Lớp học đã có trong giỏ hàng. Vui lòng xóa lớp học trước khi đăng ký ưu đãi combo !');
            } else {
                arrCourseSelected = [...arrCourseSelected, ...combo];
                this.storageService.store(CourseWebConfig.SELECTED_COURSES, arrCourseSelected);
                this.cartService.updateTotal();
                this.notification.showSuccessMessage('Thêm lớp học vào giỏ hàng thành công');
                this.router.navigate(['/']);
            }
        } else {
            this.storageService.store(CourseWebConfig.SELECTED_COURSES, combo);
            this.cartService.updateTotal();
            this.notification.showSuccessMessage('Thêm lớp học vào giỏ hàng thành công');
            this.router.navigate(['/']);
        }
    }

    private getTTMienGiamPaging(alias: string): Observable<ConvertData[]> {
        return this.courseWebService
            .get(CourseWebConstant.MIEN_GIAM + `/ThongTinLoai`, {
                alias,
            })
            .pipe(map((res: ThongTinMienGiam[]) => this.mapDataMienGiam(res)));
    }

    private mapDataMienGiam(data: ThongTinMienGiam[]): ConvertData[] {
        const groupedArray: { [keyId: number]: ThongTinMienGiam[] } = {};
        data.forEach(item => {
            const itemId = item.id;
            if (groupedArray[itemId]) {
                groupedArray[itemId].push(item);
            } else {
                groupedArray[itemId] = [item];
            }
        });
        const resultArray = [] as ConvertData[];

        // eslint-disable-next-line guard-for-in
        for (const itemId in groupedArray) {
            const group = groupedArray[itemId];
            const keyText = group.length > 1 ? 'combo' : 'don';
            const idDoiTuong = group.map(item => item.idDoiTuong)[0];
            const resultItem = {
                keyId: Number(itemId),
                children: group,
                keyText,
                idDoiTuong,
            };
            resultArray.push(resultItem);
        }
        this.isMienGiamDon = resultArray.filter(x => x.keyText === 'don').length > 1;
        const arr = resultArray
            .filter(x => x.keyText === 'combo')
            .map(x => ({
                children: x.children,
                idDoiTuong: x.idDoiTuong,
            })) as MapData[];
        this.mapDataMienGiamCombo(arr);

        return resultArray;
    }

    private mapDataMienGiamCombo(data: MapData[]): MapDataCombo[] {
        const groupedArrayCombo: { [idDoiTuong: number]: MapData[] } = {};
        data.forEach(item => {
            const itemId = item.idDoiTuong;
            if (groupedArrayCombo[itemId]) {
                groupedArrayCombo[itemId].push(item);
            } else {
                groupedArrayCombo[itemId] = [item];
            }
        });

        // eslint-disable-next-line guard-for-in
        for (const itemId in groupedArrayCombo) {
            const group = groupedArrayCombo[itemId] as MapData[];
            const resultItem = {
                keyId: Number(itemId),
                children: group,
            };
            this.arrCombo.push(resultItem);
        }

        return this.arrCombo;
    }
}
