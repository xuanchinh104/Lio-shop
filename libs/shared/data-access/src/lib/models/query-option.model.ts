export interface QueryOption {
    pageNumber: number;
    pageSize: number;
    keyword?: string;
    sortName?: string;
    sortASC?: boolean;
    isVisible?: boolean;
    isActive?: boolean;
}

export interface QueryImport {
    pageNumber?: number;
    pageSize?: number;
    sessionCode?: string;
    isValid?: boolean;
}
