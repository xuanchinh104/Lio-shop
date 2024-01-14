import { LoaiBoSungQuyenEnum, LoaiKeThuaQuyenEnum, LoaiThuHoiQuyenEnum } from './enums';

export interface GridPermission {
    g_Id: number;
    g_Name: string;
    g_GroupName: string;
    g_Order: number;
    f_Id: number;
    f_Name: string;
    f_Order: number;
    isView?: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isOption: boolean;
    lstOption: FeatureOption[];
    state?: boolean;
    isHasRole?: boolean;

    g_ModId?: number;
    g_ModKey?: string;
    g_ModName?: string;
    g_ModDesc?: string;
    g_ModGroupName?: string;
}

export interface GridGroupPermission {
    gF_Id: number;
    gF_Name: string;
    gF_GroupName: string;
    gF_ShortName: string;
    gF_Order: number;
    f_Id: number;
    f_Name: string;
    f_Order: number;
    isView?: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isOption: boolean;
    lstOfOption?: FeatureOption[];
    listOfOption?: FeatureOption[];
    state?: boolean;
    isHasRole?: boolean;

    g_ModId?: number;
    m_KeyModule?: string;
    m_TenModule?: string;
    m_MoTa?: string;
    m_GroupName?: string;
    m_CssClass: string;
}

export interface FeatureOption {
    a_Id: number;
    a_Name: string;
    isCheck: boolean;
}

export interface PermisisonOfUser {
    arrAclView: number[];
    arrAclAdd: number[];
    arrAclEdit: number[];
    arrAclDelete: number[];
    arrAclOption: number[];
}

export interface UpdatePermission extends PermisisonOfUser {
    idSelected: number;
    typeOfAddition: LoaiBoSungQuyenEnum;
    typeOfWithdraw: LoaiThuHoiQuyenEnum;
    typeOfInherited: LoaiKeThuaQuyenEnum;
    arrIdInherited: number;
}

export interface TreeGroupPermission {
    idGroupPermission: number;
    idParent: number;
    groupName: string;
    notes?: string;
    level?: number;
    location?: string;
    hasSubGroup?: boolean;

    // extensions
    value?: string;
    key?: number;
    isLeaf?: boolean;
    children?: TreeGroupPermission[];
    childrens?: TreeGroupPermission[];
    disabled?: boolean;
}
