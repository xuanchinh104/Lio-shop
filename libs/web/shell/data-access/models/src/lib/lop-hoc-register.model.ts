export interface KhoaHoc {
    total: number;
    id: number;
    alias: string;
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hocPhi: number;
    thoiGianDaoTao: string;
    ghiChu: string;
    soThuTu: number;
    anhDaiDien: string;
    idNhom: number;
    aliasNhom: string;
    tenNhom: string;
    ghiChuNhom: string;
    soThuTuNhom: number;
    moTa: string;
}

export interface LopHocRegistered {
    id: number;
    maDangKy: string;
    maHoSo: number;
    hocPhi: number;
    alias: string;
    tenKhoaHoc: string;
    tenNhomKhoaHoc: string;
    hocPhiDangKy: number;
    hocPhiLopHoc: number;
    idTrangThai: number;
    maMau: string;
    tenTrangThai: string;
    ghiChu: string;
    creationDate: string;
    thoiGianDaoTao: string;
    lyDoKhongDuyet: string;
    idTrangThaiHoSo: number;
    tenTrangThaiHoSo: string;
    idLopHoc: number;
    idKhoaHoc: number;
    maKhoaHoc: string;
    maLop: string;
    tenLop: string;
    trangThaiLopHoc: string;
    trangThaiHocVien: string;
    maMauTTLopHoc: string;
    maMauTTHocVien: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    ngayCapNhatTrangThaiHoSo: string;
    hoSoLopHocs: LopHocRegisteredDetail[];
    isHuyLop: boolean;
    isMienGiam: boolean;
    isChecked?: boolean;
    hocPhiPhaiNop: number;
    idMienGiam: number;
    soTienMienGiam: number;
    isThanhToan?: boolean;
    diemTongKet: number;
    isDat: boolean;
    isKetThuc: boolean;
    tenXepLoai: string;
    isCapVanBang: boolean;
    idHinhThuc: number;
    idHinhThucNhanBang: number;
    hinhThucNhan: string;
    hoTenNguoiNhan: string;
    soDienThoaiNguoiNhan: string;
    idTinhNguoiNhan: number;
    idHuyenNguoiNhan: number;
    idXaNguoiNhan: number;
    soNhaNguoiNhan: string;
    idDangKy: number;
    idHocVienDangKy: number;
    idLoaiMienGiam: number;
    isDaGuiVangBang: boolean;
    idVanBang: number;
    isHopDong: boolean;
    congNo: number;
    hocPhiDaNop: number;
    thoiGianBatDauNopHoSo: string;
    thoiGianKetThucNopHoSo: string;
}

export interface LopHocRegisteredDetail {
    id: number;
    idLopHoc: number;
    idLoaiHoSo: number;
    tenLoaiHoSo: string;
    soFileDinhKemToiDa: number;
    isUpload: boolean;
    isDuyet: boolean;

    loaiFiles: number[];
    type: string;
    fileAttachs: LopHocAttachment[];
}

export interface LopHocAttachment {
    id?: number;
    idHocVienDangKyKhoaHoc?: number;
    idLoaiHoSo?: number;
    displayName: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    isDeleted?: boolean;
}
