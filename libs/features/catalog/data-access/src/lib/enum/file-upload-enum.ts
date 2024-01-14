export enum FileUploadTypeEnum {
    Image = 1,
    Video = 2,
    Office = 3,
    Audio = 4,
    Application = 5,
    Undefined = 6,
}

export const FileUploadTypeDescription: { [key: number]: string } = {
    [FileUploadTypeEnum.Image]: 'Image',
    [FileUploadTypeEnum.Video]: 'Video',
    [FileUploadTypeEnum.Office]: 'Office',
    [FileUploadTypeEnum.Audio]: 'Audio',
    // [FileUploadTypeEnum.Application]: 'Application',
    // [FileUploadTypeEnum.Undefined]: 'Undefined',
};

export const FileUploadTypeList = [
    FileUploadTypeEnum.Image,
    FileUploadTypeEnum.Video,
    FileUploadTypeEnum.Office,
    FileUploadTypeEnum.Audio,
    // FileUploadTypeEnum.Application,
    // FileUploadTypeEnum.Undefined,
];
