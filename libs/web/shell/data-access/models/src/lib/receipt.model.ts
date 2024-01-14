export interface Receipt {
    transID: string;
    idSoThuTrucTuyen: number;
    soPhieu: number;
    noiDungThu: string;
    tongTien: number;
    ngayThanhToan: Date;
    isDaThanhToan: boolean;
    isDaCapNhatSoThu: boolean;
    trangThaiGD: string;
    colorTrangThaiGD: string;
    urlInvoice: string;
    isHuy: boolean;
    isHienThiNutHuyThanhToan: boolean;
    metaData: string;
}

export interface ReceiptDetail {
    ma: string;
    noiDungThu: string;
    maLop: string;
    tenLop: string;
    soTienNop: number;
    isXuatHoaDon: boolean;
    isDaXuat: boolean;
    urlInvoice: string;
    middleUrl: string;
    filePathInvoice: string;
    signStatus: string;
}
