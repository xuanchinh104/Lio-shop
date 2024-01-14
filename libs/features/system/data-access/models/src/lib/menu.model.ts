export interface FMenu {
    fG_Id: string;
    fG_Name: string;
    fG_ShortName: string;
    fG_Path: string;
    fG_Css: string;
    fG_CssBadge: string;
    fG_Order: number;
    fG_IdModule: string;
    fG_Notes: string;
    m_TenModule: string;
    m_KeyModule: string;
    m_MoTa: string;
    m_CssClass: string;
    m_GroupName: string;
    m_SoThuTu: number;
    m_CssIcon: string;
    f_Id: string;
    f_Name: string;
    f_GroupName: string;
    f_Path: string;
    f_ControllerName: string;
    f_Order: number;
    f_Css: string;
    f_CssBadge: string;
    f_ParentId: string;
    f_Notes: string;
    a_ActionType: number;

    childs?: FMenu[];
    actions?: number[];
}

export interface MenuGroupModule {
    title: string;
    groupModule: GroupModule[];
}

export interface GroupModule {
    title: string;
    icon: string;
    desc: string;
    url: string;
    shadow: string;
    manHinhs: FMenu[];
}

export interface ManHinhTree {
    title: string;
    url: string;
    order: number;
    cssBadge: string;
    manHinhs: FMenu[];
}
