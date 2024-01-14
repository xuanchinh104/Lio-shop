import { FeatureOption } from './permission.model';

export interface Role {
    id: number;
    name: string;
    notes: string;
    ordering: number;
    idParent: number;
}

export interface RoleOfList {
    id: string;
    name: string;
    notes: string;
    hasSubGroup: number;
    idParent: number;
    isCreated: boolean;
    totalUserAssignedRole: number;
}

export interface RoleAction {
    g_Id: number;
    g_Name: string;
    g_GroupName: string;
    g_Order: number;
    f_Id: string;
    f_Name: string;
    f_Order: number;
    fG_Id: string;
    isView?: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isOption: boolean;
    state?: boolean;
    isHasRole?: boolean;

    g_ModId?: number;
    g_ModKey?: string;
    g_ModName?: string;
    g_ModDesc?: string;
    g_ModGroupName?: string;

    listOfOption?: RoleOption[];

    m_KeyModule: string;
}

export interface RoleOption {
    a_Id: string;
    a_Name: string;
    isCheck?: boolean;
}

export interface RoleOptionSelected {
    arrAclView: string[];
    arrAclAdd: string[];
    arrAclEdit: string[];
    arrAclDelete: string[];
    arrAclOption: string[];
}
