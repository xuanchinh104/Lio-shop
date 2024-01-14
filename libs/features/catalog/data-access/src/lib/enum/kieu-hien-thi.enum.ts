export enum KieuHienThiEnum {
    DON_GIAN = 1,
    NANG_CAO = 2,
}

export const KieuHienThiDescription: { [key: number]: string } = {
    [KieuHienThiEnum.DON_GIAN]: 'Đơn giản',
    [KieuHienThiEnum.NANG_CAO]: 'Nâng cao',
};
