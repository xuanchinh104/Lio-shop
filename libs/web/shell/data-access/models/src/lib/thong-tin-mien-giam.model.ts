export interface ThongTinMienGiam {
    id: number;
    idLoaiMienGiam: number;
    idDoiTuong: number;
    idLopHoc: number;
    tenLop: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    hocPhi: number;
    hocPhiPhaiNop: number;
    idChiTietMienGiam: number | null;
    maLop: string;
    isXepLoai: boolean;
}
export interface ConvertData {
    keyId: number;
    keyText: string;
    idDoiTuong: number;
    children: ThongTinMienGiam[];
}
