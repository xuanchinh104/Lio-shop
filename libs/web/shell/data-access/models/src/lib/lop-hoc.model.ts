export interface LopHoc {
    total: number;
    id: number;
    maLop: string;
    tenLop: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    hocPhi: number;
    idNhom: number;
    aliasNhom: string;
    tenNhom: string;
    ghiChuNhom: string;
    soThuTuNhom: number;
    metaData: string;
    isMienGiam: boolean;
    alias: string;
    hocPhiPhaiNop: number;
    idChiTietMienGiam: number | null;
    aliasLop?: string;
    loaiDoiTuong: string;
    idCombo?: number;
    idLoaiMienGiam: number;
    isXepLoai: boolean;
    idXepLoai: number;
    thoiGianKetThucDangKy: string;
    thoiGianBatDauDangKy: string;
    thoiGianBatDauNopHoSo: string;
    thoiGianKetThucNopHoSo: string;
}

export interface LopHocByGroup {
    id: number;
    alias: string;
    tenNhom: string;
    ghiChu: string;
    soThuTu: number;
    lopHocs: LopHoc[];
}

export interface LopHocSeleted {
    id: number;
    idLoaiMienGiam: number;
    idDoiTuong: number;
    idLopHoc: number;
    idChiTietMienGiam: number | null;
    tenLop: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    hocPhi: number;
    donGiaMienGiam: string;
    hocPhiPhaiNop: number;
    idCombo: number;
    aliasNhom: string;
    isMienGiam: boolean;
    aliasLop?: string;
    alias: string;
}
