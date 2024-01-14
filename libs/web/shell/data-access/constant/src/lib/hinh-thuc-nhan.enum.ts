export enum HinhThucNhanEnum {
    TRUC_TIEP = 1,
    CHUYEN_PHAT = 2,
}
export const HinhThucNhanDescription: { [key: number]: string } = {
    [HinhThucNhanEnum.TRUC_TIEP]: 'Trực tiếp',
    [HinhThucNhanEnum.CHUYEN_PHAT]: 'Chuyển phát',
};

export const HinhThucNhanList = [HinhThucNhanEnum.TRUC_TIEP, HinhThucNhanEnum.CHUYEN_PHAT];
