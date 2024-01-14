export enum LoaiDoiTuongEnum {
    CBNV = 1,
    SINH_VIEN = 2,
    KHAC = 3,
}

export const LoaiDoiTuongDescription: { [key: number]: string } = {
    [LoaiDoiTuongEnum.CBNV]: 'Là CB/NV/GV của CTUMP',
    [LoaiDoiTuongEnum.SINH_VIEN]: 'Là sinh viên năm cuối/ học viên sau đại học đang học của CTUMP',
    [LoaiDoiTuongEnum.KHAC]: 'Là đối tượng khác',
};

export const LoaiDoiTuongList = [LoaiDoiTuongEnum.CBNV, LoaiDoiTuongEnum.SINH_VIEN, LoaiDoiTuongEnum.KHAC];

export enum LoaiDoiTuongKTTAEnum {
    SV_GV_NV = 1,
    HOC_TRUONG_KHAC = 2,
    TU_DO = 3,
}

export const LoaiDoiTuongKTTADescription: { [key: number]: string } = {
    [LoaiDoiTuongKTTAEnum.SV_GV_NV]: ' SV/GV/NV của VLU và các trường thành viên VLG',
    [LoaiDoiTuongKTTAEnum.HOC_TRUONG_KHAC]: 'Đang theo học các trường khác',
    [LoaiDoiTuongKTTAEnum.TU_DO]: 'Thí sinh tự do',
};

export const LoaiDoiTuongKTTAList = [LoaiDoiTuongKTTAEnum.SV_GV_NV, LoaiDoiTuongKTTAEnum.HOC_TRUONG_KHAC, LoaiDoiTuongKTTAEnum.TU_DO];
