export enum GioiTinhEnum {
    NAM = 1,
    NU = 0,
}

export const GioiTinh: { [key: number]: boolean } = {
    [GioiTinhEnum.NAM]: true,
    [GioiTinhEnum.NU]: false,
};

export const GioiTinhDescription: { [key: number]: string } = {
    [GioiTinhEnum.NAM]: 'Nam',
    [GioiTinhEnum.NU]: 'Nữ',
};
export const GioiTinhList = [GioiTinhEnum.NAM, GioiTinhEnum.NU];
