export interface ConfigReport {
    id: number;
    ma: string;
    ten: string;
    tieuDe: string;
    ghiChu: string;
    soThuTu: number;
}

export interface ConfigReportDetail {
    id: number;
    idSysBieuMauDynamic: number;
    columnName: string;
    columnDisplayName: string;
    textAlign: number;
    columnWidth: number;
    ghiChu: string;
    soThuTu: number;
    isVisible: boolean;
    isDeleted: boolean;
}
