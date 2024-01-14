export enum KieuDuLieuEnum {
    Y = 1,
    NUMBER = 2,
    TEXT = 3,
}

export const KieuDuLieuDescription: { [key: number]: string } = {
    [KieuDuLieuEnum.Y]: 'Y/N',
    [KieuDuLieuEnum.NUMBER]: 'Number',
    [KieuDuLieuEnum.TEXT]: 'Text',
};

export const KieuDuLieuList = [KieuDuLieuEnum.Y, KieuDuLieuEnum.NUMBER, KieuDuLieuEnum.TEXT];
