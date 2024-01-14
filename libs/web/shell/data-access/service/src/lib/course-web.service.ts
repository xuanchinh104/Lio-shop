import { Inject, Injectable, Injector } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { Observable } from 'rxjs';
import {
    BaiVietForWeb,
    CourseAttachmentRequest,
    HocVien,
    HocVienRequest,
    KhoaHoc,
    LopHoc,
    LopHocByGroup,
    LopHocDaMoPageResult,
    LopHocInGroupPageResult,
    LopHocRegistered,
    MessageAlert,
    NhomKhoaHoc,
    NhomKhoaHocByPhong,
    PhuongXa,
    QuanHuyen,
    QuocGiaForWeb,
    TaiKhoanThanhToan,
    TinhThanh,
    TinTucForWeb,
    TonGiaoForWeb,
    UserActivated,
    UserRegister,
} from '@asc/web/shell/data-access/models';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { PagedResult } from '@asc/shared/data-access';
import { map, shareReplay, tap } from 'rxjs/operators';
import { BaseWebService } from './common/base-web.service';
import { ReportUtil, SafeAny } from '@asc/shared/utils';
import { createRequestOption } from '@asc/shared/services/common';
import { DanToc, PhongBan } from '@asc/features/catalog/data-access';

export interface LopHocPageResult extends PagedResult<LopHoc[]> {
    info: {
        id: number;
        title: string;
        alias: string;
        seoTitle: string;
        seoMetaKey: string;
        seoMetaDesc: string;
    };
}

export interface CoursePagedResult extends PagedResult<KhoaHoc[]> {
    info: {
        id: number;
        title: string;
        alias: string;
        seoTitle: string;
        seoMetaKey: string;
        seoMetaDesc: string;
    };
}

@Injectable({
    providedIn: 'root',
})
export class CourseWebService extends BaseWebService {
    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);
    }

    getStudentInfo(): Observable<HocVien> {
        return this.get(CourseWebConstant.HOC_VIEN_FOR_WEB + '/Info');
    }

    getMyCourse(idTrangThai = null): Observable<LopHocRegistered[]> {
        return this.get(CourseWebConstant.HOC_VIEN_FOR_WEB + '/MyClass', {
            idTrangThai,
        });
    }

    getCourseRegistedDetail(id = 0): Observable<LopHocRegistered> {
        return this.get(CourseWebConstant.HOC_VIEN_FOR_WEB + `/MyClass/${id}`);
    }

    submitCourseAttachment(request: CourseAttachmentRequest): Observable<any> {
        return this.post(CourseWebConstant.HOC_VIEN_FOR_WEB + `/SubmitFile`, request);
    }

    registerStudent(req: HocVienRequest): Observable<HocVien> {
        return this.post(CourseWebConstant.HOC_VIEN_FOR_WEB + '/Register', req, true);
    }

    activateStudent(key: string): Observable<UserActivated> {
        return this.post(CourseWebConstant.HOC_VIEN_FOR_WEB + '/Activate', {
            key,
        });
    }

    updateStudentInfo(req: HocVienRequest): Observable<HocVien> {
        return this.put(CourseWebConstant.HOC_VIEN_FOR_WEB + '/UpdateInfo', req, true);
    }

    getNhomKhoaHoc(): Observable<NhomKhoaHoc[]> {
        return this.get(CourseWebConstant.KHOA_HOC_FOR_WEB + `/NhomKhoaHoc`, {
            sortName: 'soThuTu',
            sortASC: true,
        }).pipe(shareReplay(1));
    }

    getTinhThanhs(): Observable<TinhThanh[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + '/TinhTP');
    }

    getQuanHuyens(idTinhTP: number): Observable<QuanHuyen[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + '/QuanHuyen', {
            idTinhTP,
        });
    }

    getPhuongXas(idQuanHuyen: number): Observable<PhuongXa[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + '/PhuongXa', {
            idQuanHuyen,
        });
    }

    getDanTocs(): Observable<DanToc[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + '/DanToc', {
            sortName: 'soThuTu',
            sortASC: true,
        });
    }

    getLopHocByGroup(pageSize: number, pageNumber: number): Observable<LopHocByGroup[]> {
        return this.get(CourseWebConstant.LOP_HOC_FOR_WEB + `/LopHocInGroup`, {
            pageSize,
            pageNumber,
        });
    }

    getLopHocPaging(alias: string, pageSize: number, pageNumber: number, keyword: string): Observable<LopHocPageResult> {
        return this.get(CourseWebConstant.LOP_HOC_FOR_WEB + `/LopHoc`, {
            alias,
            pageSize,
            pageNumber,
            keyword,
        });
    }

    registerLopHocFirst(req: unknown): Observable<UserRegister> {
        return this.post(CourseWebConstant.LOP_HOC_FOR_WEB + `/DangKyLopHoc`, req);
    }

    registerLopHoc(req: unknown): Observable<MessageAlert> {
        return this.post(CourseWebConstant.HOC_VIEN_FOR_WEB + '/RegisterClass', req, true);
    }

    getLopHocForSearch(keyword: string, pageSize: number, pageNumber: number): Observable<LopHocByGroup[]> {
        return this.get(CourseWebConstant.LOP_HOC_FOR_WEB + `/LopHocInGroup`, {
            keyword,
            pageSize,
            pageNumber,
        });
    }

    getTaiKhoanThanhToans(): Observable<TaiKhoanThanhToan[]> {
        return this.get(CourseWebConstant.TAI_KHOAN_TT, {}).pipe(map(res => res.items));
    }

    getPhongBans(): Observable<PhongBan[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + '/PhongBan', {
            isHienThi: true,
        }).pipe(map(res => res.items));
    }

    getCourseByDepartment(alias: string, pageSize: number, pageNumber: number): Observable<NhomKhoaHocByPhong[]> {
        return this.get(CourseWebConstant.KHOA_HOC_FOR_WEB + `/NhomKhoaByPhong`, {
            alias,
            pageSize,
            pageNumber,
        });
    }

    getLopHocInGroupKhoa(alias: string, pageSize: number, pageNumber: number): Observable<LopHocInGroupPageResult> {
        return this.get(CourseWebConstant.LOP_HOC_FOR_WEB + `/LopHocInGroupKhoa`, {
            alias,
            pageSize,
            pageNumber,
        });
    }

    getCoursePaging(alias: string, pageSize: number, pageNumber: number, keyword?: string): Observable<CoursePagedResult> {
        return this.get(CourseWebConstant.KHOA_HOC_FOR_WEB + `/KhoaHoc`, {
            alias,
            pageSize,
            pageNumber,
            keyword,
        });
    }

    getNewBlog(pageSize: number, pageNumber: number, alias?: string): Observable<PagedResult<TinTucForWeb[]>> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + `/TinTucForWeb`, {
            pageSize,
            pageNumber,
            alias,
            sortName: 'creationDate',
        });
    }

    getLopHocDaMo(pageSize: number, pageNumber: number, sortName?: string, keyword?: string): Observable<LopHocDaMoPageResult> {
        const idsTrangThaiLop = [2].join(',');
        return this.get(CourseWebConstant.LOP_HOC_FOR_WEB + `/LopHocDaMo`, {
            idsTrangThaiLop,
            pageSize,
            pageNumber,
            sortName,
            keyword,
        });
    }

    getNewPost(alias?: string, pageSize?: number, pageNumber?: number): Observable<PagedResult<BaiVietForWeb[]>> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + `/BaiVietForWeb`, {
            alias,
            sortName: 'ngayTao',
            pageSize,
            pageNumber,
        });
    }

    getTonGiao(): Observable<TonGiaoForWeb[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + `/TonGiao`, {
            sortName: 'soThuTu',
            sortASC: true,
        });
    }

    getQuocGias(): Observable<QuocGiaForWeb[]> {
        return this.get(CourseWebConstant.COMMON_FOR_WEB + `/QuocGia`, {
            sortName: 'soThuTu',
            sortASC: true,
        });
    }

    // get
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

    // post
    onReportData(url: string, option: SafeAny): Observable<SafeAny> {
        return this.download(url, option).pipe(
            tap(res => {
                ReportUtil.downloadWithContenDiposition(res);
            })
        );
    }
}
