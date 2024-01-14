export interface MainSetting {
    id: number;
    tenNhom: string;
    hinhDaiDien: string;
    soThuTu: number;
    nhomCauHinh: SettingItem[];
}

export interface SettingItem {
    idTheme: number;
    idCauHinh: number;
    keyCauHinh: string;
    tenCauHinh: string;
    loaiCauHinh: number;
    moTaCauHinh: string;
    hinhDaiDien: string;
    soThuTu: number;
    valueCauHinh: string;
    valueString: string;
    valueInt: number;
    valueObj: any;
}
