export enum ELanguageResouce {
    VI = 1,
    EN = 2
}

export const ELanguageResouceName = {
    [ELanguageResouce.VI]: 'vi',
    [ELanguageResouce.EN]: 'en',
};

export enum EProjectType {
    SYS = 1,
    KDCL = 2,
    DTNN = 3
}

export const EProjectTypeName = {
    [EProjectType.SYS] : 'Hệ thống',
    [EProjectType.KDCL]: 'Đảm bảo chất lượng',
    [EProjectType.DTNN]: 'Đào tạo ngắn hạn',
};
