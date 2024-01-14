export interface PaymentInitRequest {
    bank: BankRequest;
    courses: CourseRequest[];
    idTaiKhoanThanhToan: number;
    isXuatHoaDon: boolean;
    metaInitPay: MetaInitPay;
}

export interface BankRequest {
    id: number;
    maNganHang: string;
    tenNganHang: string;
    strRequest01: string;
    strRequest02: string;
    strRequest03: string;
    metaData: string;
}

export interface CourseRequest {
    id: number;
    maDangKy: string;
    idLopHoc: number;
    idKhoaHoc: number;
    // maLop: string;
    // tenLop: string;
    // maKhoaHoc: string;
    tenKhoaHoc: string;
    hocPhi: number;
    alias: string;
    metaData: string;
}

export interface MetaInitPay {
    isToken: boolean | null;
    channel: any;
    idLoaiHinhThanhToan: number;
    ipAddress: string;
    transactionMethod: number | null;
    idLoaiThu: number | null;
    isQRTinh: boolean | null;
    thongTinThiSinhBoSung: string;
}

export interface QRCode {
    bank: null;
    virtualAcctName: null;
    virtualAcctId: string;
    qrImg: string;
    releaseTime: null;
    period: number;
    amount: number;
    fee: number;
    totalAmount: number;
    currency: null;
    description: string;
    partnerCode: string;
    createDate: string;
    hashCode: string;
    bankOrderID: null;
}
