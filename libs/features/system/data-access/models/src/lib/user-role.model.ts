import { SafeAny } from '@asc/shared/utils';

export interface UserRoleOfList {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    roles: string;
    maNhanSu: string;

    email: string;
    phoneNumber: string;
    idGioiTinh: number;
    tenGioiTinh: string;
    idPhongBan: number;
    tenPhongBan: string;
    idCoSo: number;
    tenCoSo: string;
    idChucVu: number;
    tenChucVu: string;
    address: string;
    ngaySinh: string;

    groupPemission: SafeAny[];
}
