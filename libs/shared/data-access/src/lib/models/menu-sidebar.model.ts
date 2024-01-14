export interface MenuSidebar {
    m_KeyModule: string;
    m_ToTa: string;
    m_GroupName: string;
    m_CssClass: string;
    title: string;
    link: string;
    css: string;
    cssBadge: string;
    types: number[];

    subMenu?: MenuSidebar[];
    options?: KeyOption[];
}

export interface MenuSidebarGroup {
    arr: MenuSidebar[];
}

export interface KeyOption {
    key: string;
    title: string;
}
