export interface UploadFileResponse {
    prefixKey: string;
    originalFileName: string;
    trustedFileName: string;
    path: string;
    size: number;
}

export interface FileInfo {
    id: number;
    name: string;
    type: number;
    size: number;
    path: string;
}
