export enum KhoaHocEnum {
    TIET = 1,
    TUAN = 2,
    THANG = 3,
    BUOI = 4,
    NGAY = 5,
}

export const KhoaHocDescription: { [key: number]: string } = {
    [KhoaHocEnum.TIET]: 'Tiết',
    [KhoaHocEnum.TUAN]: 'Tuần',
    [KhoaHocEnum.THANG]: 'Tháng',
    [KhoaHocEnum.BUOI]: 'Buổi',
    [KhoaHocEnum.NGAY]: 'Ngày',
};

export const KhoaHocList = [KhoaHocEnum.TIET, KhoaHocEnum.BUOI, KhoaHocEnum.NGAY, KhoaHocEnum.TUAN, KhoaHocEnum.THANG];
