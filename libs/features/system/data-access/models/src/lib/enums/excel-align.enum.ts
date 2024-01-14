export enum ExcelAlignEnum {
    GENERAL = 0,
    LEFT = 1,
    CENTER = 2,
    RIGHT = 3,
    FILL = 4,
    JUSTIFY = 5,
    CENTERACROSSSELECTION = 6,
    DISTRIBUTED = 7
}

export const ExcelAlignDescription: { [key: number]: string } = {
    [ExcelAlignEnum.GENERAL]              : 'General',
    [ExcelAlignEnum.LEFT]                 : 'Left',
    [ExcelAlignEnum.CENTER]               : 'Center',
    [ExcelAlignEnum.RIGHT]                : 'Right',
    [ExcelAlignEnum.FILL]                 : 'Fill',
    [ExcelAlignEnum.JUSTIFY]              : 'Justify',
    [ExcelAlignEnum.CENTERACROSSSELECTION]: 'CenterAcrossSelection',
    [ExcelAlignEnum.DISTRIBUTED]          : 'Distributed',
};

export const ExcelAlignList = [
    ExcelAlignEnum.GENERAL,
    ExcelAlignEnum.LEFT,
    ExcelAlignEnum.CENTER,
    ExcelAlignEnum.RIGHT,
    ExcelAlignEnum.FILL,
    ExcelAlignEnum.JUSTIFY,
    ExcelAlignEnum.CENTERACROSSSELECTION,
    ExcelAlignEnum.DISTRIBUTED
]
