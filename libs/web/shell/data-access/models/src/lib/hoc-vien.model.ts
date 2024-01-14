import { HocVienRequest } from './request';

export interface HocVien extends HocVienRequest {
    id: number;
    maHocVien: string;
    password: string;
    userName: string;
    hoDem: string;
    ten: string;
    idGioiTinh: number;
    ngaySinh: string;
    email: string;
    soDienThoai: string;
    soCMND: string;
    hinhAnh: string;
    ghiChu: string;
    hoTen: string;
    tenGioiTinh: string;
    tenLoaiDoiTuong: string;
    tenPhuongXaLienLac: string;
    tenQuanHuyenLienLac: string;
    tenTinhTPLienLac: string;
    tenXaThuongTru: string;
    tenHuyenThuongTru: string;
    tenTinhThuongTru: string;
    tenTinhTPNoiCapCMND: string;
    tenTinhTPNoiSinh: string;
    anhTheUrl: string;
}
