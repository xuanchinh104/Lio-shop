import { CotDiemSuDung } from './khoa-hoc.model';

export interface NhomKhoaHoc {
    id: number;
    tenNhomKhoaHoc: string;
    maNhomKhoaHoc: string;
    hinhDaiDien: string;
    ghiChu: string;
    soThuTu: number;
    isVisible: boolean;
    seoAlias: string;
    seoTitle: string;
    seoMetaKey: string;
    seoMetaDesc: string;
    cotDiemSuDung: CotDiemSuDung[];
    cotDiemSuDungJson: CotDiemSuDung[];
    loaiDieuKienCapChungChi: number;
    diemTongKetDatTu: number;
    thangDiemTongKet: number;
    cachTinhDiemTongKet: number;
    visibleText: string;
    isThiLai: boolean;
    nhomKhoaHocChiTiets: NhomKhoaHocChiTiet[];
}

export interface NhomKhoaHocChiTiet {
    id: number;
    tenLoaiHoSo: string;
    idLoaiHoSo: number;
    soFileDinhKemToiDa: number;
}
