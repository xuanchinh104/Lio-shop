import { PagedResult } from '@asc/shared/data-access';

export interface LopHocDaMo {
    id: number;
    maLop: string;
    tenLop: string;
    thoiGianBatDauDangKy: string;
    thoiGianKetThucDangKy: string;
    thoiGianBatDauNopHoSo: string;
    thoiGianKetThucNopHoSo: string;
    siSoDangKy: number;
    siSoToiThieu: number;
    siSoToiDa: number;
    tenTrangThai: string;
    maMau: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    tenKhoaHoc: string;
    aliasLop: string;
    aliasNhom: string;
    hocPhi: number;
    total: number;
    idNhom: number;
    tenNhom: string;
    ghiChuNhom: string;
    soThuTuNhom: number;
    metaData: string;
    isMienGiam: boolean;
    alias: string;
    hocPhiPhaiNop: number;
    idChiTietMienGiam: number | null;
    loaiDoiTuong: string;
    idCombo?: number;
    idLoaiMienGiam: number;
    aliasPhong: string;
    aliasKhoa: string;
    tenPhongBan: string;
    tenNhomKhoaHoc: string;
    anhDaiDien: string;
}

export interface LopHocDaMoPageResult extends PagedResult<LopHocDaMo[]> {
    info: {
        id: number;
        title: string;
        alias: string;
        seoTitle: string;
        seoMetaKey: string;
        seoMetaDesc: string;
    };
}
