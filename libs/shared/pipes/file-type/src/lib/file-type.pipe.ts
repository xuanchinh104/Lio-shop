import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}

    public transform(value: string): string {
        const fileExtension = value.split('.').reverse()[0];
        switch (fileExtension) {
            case 'pdf':
                return 'file-pdf-big';
            case 'docx':
                return 'file-doc-big';
            case 'doc':
                return 'file-doc-big';
            case 'xlsx':
                return 'file-xls-big';
            case 'xls':
                return 'file-xls-big';
            case 'pptx':
                return 'file-ppt-big';
            case 'ppt':
                return 'file-ppt-big';
            case 'jpg':
                return 'file-jpg-big';
            case 'png':
                return 'file-png-big';
            case 'zip':
                return 'file-zip-big';
            case 'rar':
                return 'file-rar-big';
            default:
                return 'file-other-big';
        }
    }
}
