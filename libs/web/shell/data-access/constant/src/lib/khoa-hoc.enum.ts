export enum KhoaHocEnum {
    TIET = 1,
    TUAN = 2,
    THANG = 3,
    BUOI = 4,
    NGAY = 5,
}

export const KhoaHocDescription: { [key: number]: string } = {
    [KhoaHocEnum.TIET]: 'Tiết',
    [KhoaHocEnum.TUAN]: 'Tuần',
    [KhoaHocEnum.THANG]: 'Tháng',
    [KhoaHocEnum.BUOI]: 'Buổi',
    [KhoaHocEnum.NGAY]: 'Ngày',
};

export enum PaymentTypeEnum {
    THE_NOI_DIA = 1,
    VI_DIEN_TU = 2,
    THE_QUOC_TE = 3,
}

export const PaymentTypeDescription: { [key: number]: string } = {
    [PaymentTypeEnum.THE_NOI_DIA]: 'Thẻ nội địa',
    [PaymentTypeEnum.VI_DIEN_TU]: 'Ví điện tử',
    [PaymentTypeEnum.THE_QUOC_TE]: 'Thẻ quốc tế',
};

export const PaymentTypeImage: { [key: number]: string } = {
    [PaymentTypeEnum.THE_NOI_DIA]: './assets/web/icon-thenoidia.svg',
    [PaymentTypeEnum.VI_DIEN_TU]: './assets/web/icon-vidientu.svg',
    [PaymentTypeEnum.THE_QUOC_TE]: './assets/web/icon-thequocte.svg',
};

export enum UserActivatedStatus {
    ActivatedSuccess,
    Activated,
    NotExisting,
}

export enum TrangThaiHoSoEnum {
    CHUA_CAP_NHAT = 0,
    CHO_DUYET = 1,
    DA_DUYET = 2,
    KHONG_DUYET = 3,
}

export const TrangThaiHoSoColor: { [key: number]: string } = {
    [TrangThaiHoSoEnum.CHUA_CAP_NHAT]: '#F97316',
    [TrangThaiHoSoEnum.CHO_DUYET]: '#F59E0B',
    [TrangThaiHoSoEnum.DA_DUYET]: '#22C55E',
    [TrangThaiHoSoEnum.KHONG_DUYET]: '#EF4444',
};
