export interface ResponseData<T> {
    result: T;
    errorMessages: ErrorMessage[];
    warningMessages: WarningMessage[];
    isOk: boolean;
}

export interface ErrorMessage {
    errorCode: string;
    errorMessage: string;
    errorValues: string[];
}

export interface WarningMessage {
    warningCode: string;
    warningMessage: string;
    warningValues: string[];
}

export interface PagedResult<T> {
    items: T;
    pagingInfo: PagingInfo;
}

export interface PagedLoadMore<T> {
    items: T;
    pagingInfo: string;
    totalItems: number;
}

export interface PagingInfo {
    pageSize: number;
    pageNumber: number;
    totalItems?: number;
}

export interface AccessToken<T> {
    errorCode: string;
    message: string;
    accessToken: T;
}
