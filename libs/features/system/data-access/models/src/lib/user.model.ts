export interface User {
    id: number;
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    groupName: string;
    parentId: string;
    address: string;
    email: string;
    mobileNumber: string;
    phoneNumber: string;
    isActive: boolean;
    groupId: number;
    idMap: string;
    hoDem: string;
    ten: string;
    diaChi: string;
    soDienThoai: number;
    idPhongBan: number;
    maNhanSu: string;
}

export interface UserOfList {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    parentId: string;
    address: string;
    email: string;
    idPhongBan: number;
    tenPhongBan: string;
    userType: number;
}
