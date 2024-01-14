export interface KhoaHoc {
    id: number;
    idNhomKhoaHoc: number;
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hocPhi: number;
    thoiGianDaoTao: number;
    loaiThoiGian: number;
    anhDaiDien: string;
    ghiChu: string;
    soThuTu: number;
    isChoPhepDangKy: boolean;
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
    khoaHocChiTiets: KhoaHocChiTiet[];
    tenNhomKhoaHoc: string;
    thoiGianText: string;
    visibleText: string;
    choPhepDangKyText: string;
    hocPhiText: string;
    soTietLyThuyet: number;
    soTietThucHanh: number;
    isCapBang: boolean;
}

export interface CotDiemSuDung {
    cotDiem: string;
    label: string;
    heSo: number | null;
    thiLai: number | null;
}

export interface KhoaHocChiTiet {
    id: number;
    tenLoaiHoSo: string;
    idLoaiHoSo: number;
    soFileDinhKemToiDa: number;
}
