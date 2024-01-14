export interface AppMenu {
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
    f_ShortName: string;
    f_ControllerName: string;
    f_Order: number;
    f_Css: string;
    f_CssBadge: string;
    f_ParentId: string;
    f_Notes: string;
    a_ActionType: number;

    childs?: AppMenu[];
    actions?: number[];
}

export interface AppMenuOption {
    title: string;
    key: string;
}

export interface ParentModule {
    title: string;
    modules: AppModuleTree[];
}

export interface AppModuleTree {
    title: string;
    icon: string;
    desc: string;
    url: string;
    shadow: string;
    manHinhs: AppMenu[];
}

export interface AppMenuTree {
    title: string;
    url: string;
    order: number;
    cssBadge: string;
    manHinhs: AppMenu[];
    isMainMenu: boolean;
    isActive?: boolean;
}

export interface MenuResponse {
    items: AppMenu[];
    options: AppMenuOption[];
}
