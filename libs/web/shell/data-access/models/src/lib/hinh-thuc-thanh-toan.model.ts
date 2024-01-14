export interface HinhThucThanhToan {
    loaiHinhThanhToan: number;
    tenLoaiHinhThanhToan: string;
    banks: Bank[];
}

export interface Bank {
    id: number;
    maNganHang: string;
    tenNganHang: string;
    bankLogoUrl: string;
    isTrungGianTT: number;
    tmnCode: string;
    thongBao: string;
    phiDV: number;
    phiDVPhanTram: number;
    stt: number;
    ghiChu: string;
    metaData: string;
    strRequest01: string;
    strRequest02: string;
    strRequest03: string;
    idLoaiHinhThanhToan: number;
    tenLoaiHinhThanhToan: string;
}
