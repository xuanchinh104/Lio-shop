export enum DiemTongKetEnum {
    TRUNG_BINH = 1,
    TONG = 2,
}

export const DiemTongKetDescription: { [key: number]: string } = {
    [DiemTongKetEnum.TRUNG_BINH]: 'Trung bình',
    [DiemTongKetEnum.TONG]: 'Tổng',
};

export const DiemTongKetList = [DiemTongKetEnum.TRUNG_BINH, DiemTongKetEnum.TONG];
