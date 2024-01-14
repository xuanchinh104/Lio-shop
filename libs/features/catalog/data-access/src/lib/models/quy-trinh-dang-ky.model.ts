export interface QuyTrinhDangKy {
    moTa: string;
    id: number;
    tenQuyTrinh: string;
    hinhAnh: string;
    valueJsons: BuocQuyTrinh[];
}

export interface BuocQuyTrinh {
    tenBuoc: string;
    id: number;
}
