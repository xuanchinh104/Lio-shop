export interface UserActivated {
    id: number;
    email: string;
    hoDem: string;
    ten: string;
    maHocVien: string;
    trangThai: number;
}

export interface UserRegister {
    id: number;
    maHocVien: string;
    hoDem: string;
    ten: string;
    idGioiTinh: number;
    ngaySinh: string;
    email: string;
    soDienThoai: string;
}
