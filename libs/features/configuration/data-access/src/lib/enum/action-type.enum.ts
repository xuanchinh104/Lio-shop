export enum ActionTypeEnum {
    XEM = 1,
    THEM = 2,
    SUA = 3,
    XOA = 4,
    TUY_CHON = 5,
}

export const ActionTypeDescription: { [key: number]: string } = {
    [ActionTypeEnum.XEM]: 'Xem',
    [ActionTypeEnum.THEM]: 'Thêm',
    [ActionTypeEnum.SUA]: 'Sửa',
    [ActionTypeEnum.XOA]: 'Xóa',
    [ActionTypeEnum.TUY_CHON]: '',
};
