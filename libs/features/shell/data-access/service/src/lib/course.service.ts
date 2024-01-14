import { Inject, Injectable, Injector } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { ApiService, createRequestOption } from '@asc/shared/services/common';
import { Observable } from 'rxjs';
import {
    CatalogConstant,
    CoSo,
    DanToc,
    DonViHopTac,
    KyHieuHoaDon,
    LoaiLop,
    NamDaoTao,
    NhomKhoaHoc,
    PhongBan,
    PhuongXa,
    QuanHuyen,
    QuocGia,
    TaiKhoanThanhToan,
    TinhTP,
    TonGiao,
    TrangThaiLopHoc,
} from '@asc/features/catalog/data-access';
import { map, tap } from 'rxjs/operators';
import { ReportUtil, SafeAny } from '@asc/shared/utils';
import { DanhMucTinTuc, WebManagerConstant } from '@asc/features/website-manager/data-access';

@Injectable({
    providedIn: 'root',
})
export class CourseService extends ApiService {
    namDaoTaosRequest$!: Observable<NamDaoTao[]>;
    coSo$!: Observable<CoSo[]>;

    trangThaiLopHoc$!: Observable<TrangThaiLopHoc[]>;

    tinhThanhs$!: Observable<TinhTP[]>;

    quocGia$!: Observable<QuocGia[]>;
    danToc$!: Observable<DanToc[]>;

    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);

        this.setConfig('COURSE');
    }

    getNamDaoTaos(): Observable<NamDaoTao[]> {
        return (this.namDaoTaosRequest$ = this.get(CatalogConstant.NAM_DAO_TAO, {
            isVisible: true,
        }).pipe(map(res => res.items)));
    }

    getNhomKhoaHocs(): Observable<NhomKhoaHoc[]> {
        return this.get(CatalogConstant.NHOM_KHOA_HOC, {
            isVisible: true,
        }).pipe(map(res => res.items));
    }

    getTrangThaiLop(): Observable<TrangThaiLopHoc[]> {
        return (this.trangThaiLopHoc$ = this.get(CatalogConstant.TRANG_THAI_LOP_HOC + '/List', {}).pipe(map(res => res.items)));
    }

    getTinhThanhs(): Observable<TinhTP[]> {
        return (this.tinhThanhs$ = this.get(CatalogConstant.TINH_TP, {}).pipe(map(res => res.items)));
    }

    getQuanHuyens(idTinhTP: number): Observable<QuanHuyen[]> {
        return this.get(CatalogConstant.QUAN_HUYEN, {
            idTinhTP,
        }).pipe(map(res => res.items));
    }

    getPhuongXas(idQuanHuyen: number): Observable<PhuongXa[]> {
        return this.get(CatalogConstant.PHUONG_XA, {
            idQuanHuyen,
        }).pipe(map(res => res.items));
    }

    getQuocGias(): Observable<QuocGia[]> {
        return (this.quocGia$ = this.get(CatalogConstant.QUOC_GIA, {
            sortName: 'soThuTu',
            sortASC: true,
        }).pipe(map(res => res.items)));
    }

    getDanTocs(): Observable<DanToc[]> {
        return (this.danToc$ = this.get(CatalogConstant.DAN_TOC, {
            sortName: 'soThuTu',
            sortASC: true,
        }).pipe(map(res => res.items)));
    }

    getLoaiLop(): Observable<LoaiLop[]> {
        return this.get<LoaiLop>(CatalogConstant.LOAI_LOP).pipe(map(res => res.items));
    }

    getDonViHopTac(): Observable<DonViHopTac[]> {
        return this.get(CatalogConstant.DON_VI_HOP_TAC, {}).pipe(map(res => res.items));
    }

    getPhongBans(): Observable<PhongBan[]> {
        return this.get(CatalogConstant.PHONG_BAN, {
            isHienThi: true,
        }).pipe(map(res => res.items));
    }

    getTaiKhoanThanhToans(): Observable<TaiKhoanThanhToan[]> {
        return this.get(CatalogConstant.TAI_KHOAN_TT, {}).pipe(map(res => res.items));
    }

    getKyHieuHoaDon(): Observable<KyHieuHoaDon[]> {
        return this.get(CatalogConstant.TAI_KHOAN_TT + '/KyHieuHoaDon', {});
    }

    getDanhMucTin(): Observable<DanhMucTinTuc[]> {
        return this.get(WebManagerConstant.DANH_MUC_TIN_TUC, {}).pipe(map(res => res.items));
    }

    getTonGiao(): Observable<TonGiao[]> {
        return this.get(CatalogConstant.TON_GIAO, {
            sortName: 'soThuTu',
            sortASC: true,
        }).pipe(map(res => res.items));
    }

    onExportData(url: string, option: SafeAny): Observable<SafeAny> {
        return this.downloadReport(url, option).pipe(
            tap(res => {
                ReportUtil.downloadWithContenDiposition(res);
            })
        );
    }

    downloadReport(api: string, data: SafeAny, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        const options = createRequestOption(data);
        return this.http.get(url, {
            params: options,
            observe: 'response',
            responseType: 'blob',
        });
    }

    onExportDynamic(data: SafeAny): Observable<SafeAny> {
        const url = 'SysBieuMauDynamics/Export';
        return this.downloadReportDynamic(url, data).pipe(
            tap(res => {
                ReportUtil.downloadWithContenDiposition(res);
            })
        );
    }

    downloadReportDynamic(api: string, data: SafeAny, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        return this.http.post(url, data, {
            observe: 'response',
            responseType: 'blob',
        });
    }

    // post

    onReportData(url: string, option: SafeAny): Observable<SafeAny> {
        return this.download(url, option).pipe(
            tap(res => {
                ReportUtil.downloadWithContenDiposition(res);
            })
        );
    }
}
