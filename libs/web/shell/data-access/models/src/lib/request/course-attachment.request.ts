export interface CourseAttachmentRequest {
    idHocVienDangKyKhoaHoc: number;
    idKhoaHoc: number;
    hoSoKhoaHocs: CourseAttachmentDetailRequest[];
}

export interface CourseAttachmentDetailRequest {
    idLoaiHoSo: number;
    fileAttachs: FileAttachRequest[];
}

export interface FileAttachRequest {
    id: number;
    displayName: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    isDeleted: boolean;
}
