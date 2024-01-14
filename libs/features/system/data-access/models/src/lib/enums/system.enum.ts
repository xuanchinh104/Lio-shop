export enum TrangThaiDongBoNhanSuEnum {
    CHUA_DONG_BO,
    DA_DONG_BO,
}

export const TrangThaiDongBoNhanSuDescription = {
    [TrangThaiDongBoNhanSuEnum.CHUA_DONG_BO]: 'Chưa đồng bộ',
    [TrangThaiDongBoNhanSuEnum.DA_DONG_BO]: 'Đã đồng bộ',
};

// --- Loại bổ sung quyền
export enum LoaiBoSungQuyenEnum {
    KhongApDung = 1,
    ApDungCapDuoiGanNhat = 2,
    ApDungTatCaCapDuoi = 3,
}

export const LoaiBoSungQuyenDescription = new Map<number, string>([
    [LoaiBoSungQuyenEnum.KhongApDung, 'Không áp dụng'],
    [LoaiBoSungQuyenEnum.ApDungCapDuoiGanNhat, 'Áp dụng cấp dưới gần nhất'],
    [LoaiBoSungQuyenEnum.ApDungTatCaCapDuoi, 'Áp dụng tất cả cấp dưới'],
]);

// --- Loại thu hồi quyền
export enum LoaiThuHoiQuyenEnum {
    ThuHoiTatCa = 1,
    KhongThuHoi = 2,
}

export const LoaiThuHoiQuyenDescription = new Map<number, string>([
    [LoaiThuHoiQuyenEnum.ThuHoiTatCa, 'Thu hồi tất cả'],
    [LoaiThuHoiQuyenEnum.KhongThuHoi, 'Không thu hồi'],
]);

// --- Loại kế thừa quyền
export enum LoaiKeThuaQuyenEnum {
    KhongApDung = 1,
    KeThuaQuyenTuNhom = 2,
}

export const LoaiKeThuaQuyenDescription = new Map<number, string>([
    [LoaiKeThuaQuyenEnum.KhongApDung, 'Không áp dụng'],
    [LoaiKeThuaQuyenEnum.KeThuaQuyenTuNhom, 'Kế thừa quyền từ nhóm'],
]);
