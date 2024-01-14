export interface FileMedia {
    idGuid: string;
    displayName: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    creationDate: Date;
    // ext
    checked?: boolean;
    selected?: boolean;
    idGuidFile: string;
}
