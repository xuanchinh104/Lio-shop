export const AppConstant = {
    VERSION: Math.floor(Math.random() * 999999),
    NO_AVATAR_URL: './assets/images/no-avatar.jpg',
    CURRENT_LANG: 'current_lang',
    TITLE: 'Thông báo',
    TYPE: {
        SUCCESS: 'success',
        DANGER: 'danger',
        WARNING: 'warning',
    },
    NO_IMAGE_URL: '',
};

export const FOLDER = {};

export const PageConfig = {
    buttonCount: 5,
    pageSizes: [10, 20, 50, 100],
    previousNext: true,
};

export const PageConfigExtra = {
    buttonCount: 5,
    pageSizes: [50, 100, 500, 1000],
    previousNext: true,
};

export const ModalDeleteConfig = {
    title: 'Bạn có muốn xóa dòng này ?',
    content: '<b style="color: red;">Xác nhận xóa</b>',
    yes: 'Có, xóa dữ liệu',
    no: 'Không',
};

export const ModalDeleteOption = {
    nzTitle: `Xác nhận xóa`,
    nzContent: `Bạn có chắc chắn muốn xóa những dòng này không?`,
    nzOkText: ModalDeleteConfig.yes,
    nzCancelText: ModalDeleteConfig.no,
    nzOkDanger: true,
};

export const ReziseTable = 220;

export const PrefixService = {
    ACL: 'ACL',
    DM: 'DM',
    RBAC: 'RBAC',

    HRM_SDTC: 'HRM_SDTC',
    HRM_TREE: 'HRM_TREE',
    HRM_HOSO: 'HRM_HOSO',

    EOFFICE_THONG_BAO: 'EOFFICE_THONGBAO',
    EOFFICE_MAIL: 'EOFFICE_MAIL',
    EOFFICE_LICH: 'EOFFICE_LICH',
    EOFFICE_CONG_VIEC: 'EOFFICE_CONGVIEC',
    EOFFICE_HOSO: 'EOFFICE_HOSO',
    EOFFICE_VANBAN: 'EOFFICE_VANBAN',

    LMS_EXAM: 'LMS_EXAM',
    LMS_HOCLIEU: 'LMS_HOCLIEU',

    IMPORT: 'IMPORT',
    TKB: 'TKB_LICH',
    DAO_TAO_CTK: 'DAOTAO_CTK',
    SYSTEM_DM: 'SYSTEM_DM',
    HVSV_LOPHOC: 'HVSV_LOPHOC',
    HVSV_SINHVIEN: 'HVSV_SINHVIEN',
    TUYEN_SINH: 'TUYENSINH',

    TAI_CHINH: 'TAICHINH',

    WEB_CMS: 'WEB_CMS',
    WEB_JOB: 'WEB_JOB',
    WEB_STUDENT: 'WEB_STUDENT',
};
