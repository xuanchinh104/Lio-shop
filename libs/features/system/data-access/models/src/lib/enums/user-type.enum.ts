export enum UserTypeEnum {
    HE_THONG = 0,
    NHAN_SU = 1,
    HOC_VIEN_DAO_TAO_NGAN_HAN = 4,
}

export const UserTypeDescription: { [key: number]: string } = {
    [UserTypeEnum.HE_THONG]: 'Hệ thống',
    [UserTypeEnum.NHAN_SU]: 'Nhân sự',
    [UserTypeEnum.HOC_VIEN_DAO_TAO_NGAN_HAN]: 'Học viên đào tạo ngắn hạn',
};

export const UserTypeList = [UserTypeEnum.HE_THONG, UserTypeEnum.NHAN_SU, UserTypeEnum.HOC_VIEN_DAO_TAO_NGAN_HAN];
