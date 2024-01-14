import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { fromEvent, Observable, of } from 'rxjs';
import { SafeAny } from '@asc/shared/utils';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { ResponseData } from '@asc/shared/data-access';

export interface FileUpload {
    extension: string;
    originalFileName: string;
    path: string;
    prefixKey: string;
    size: number;
    trustedFilename: string;
}

export interface FileRequest {
    id: null | number;
    url: string;
    proxyUrl: string;
    fileName: string;
    contentType: string;
    size: number;
}

export interface FileResponse {
    id: null;
    url: string;
    proxyUrl: string;
    fileName: string;
    contentType: string;
    size: number;
}

@Injectable({ providedIn: 'root' })
export class FileService {
    private apiUrl: string;
    private apiAvatarUrl: string;

    constructor(private http: HttpClient, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        this.apiUrl = `${this.env.apiServer}/api/${this.env.version}/`;
        this.apiAvatarUrl = `${this.env.apiServer}/api/${this.env.version}/Media/Files/UploadFiles?moduleName=Course&functionName=Course`;
    }

    uploadFile(file: FileList): Observable<FileRequest> {
        const fd = new FormData();
        fd.append('files', file[0], file[0].name);
        return this.http.post<ResponseData<FileUpload[]>>(this.apiAvatarUrl, fd).pipe(
            map(res => res.result),
            map(res => ({
                id: null,
                url: res[0].path,
                proxyUrl: res[0].path,
                fileName: res[0].originalFileName,
                contentType: res[0].extension,
                size: res[0].size,
            }))
        );
    }

    uploadFileAttachment(file: FileList): Observable<FileRequest[]> {
        const fd = new FormData();
        Array.from(file).forEach((f: any) => {
            fd.append('files', f, f.name);
        });
        // fd.append('files', file[0], file[0].name);
        return this.http.post<ResponseData<FileUpload[]>>(this.apiAvatarUrl, fd).pipe(
            map(res => res.result),
            map(res =>
                res.map(m => ({
                    id: null,
                    url: m.path,
                    proxyUrl: m.path,
                    fileName: m.originalFileName,
                    contentType: m.extension,
                    size: m.size,
                }))
            )
        );
    }

    /**
     * Downloads file
     * @returns
     * @param url
     * @param option
     */
    downloadFile(url: string, option: SafeAny): Observable<SafeAny> {
        return this.http
            .post(this.apiUrl + url, option, {
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(catchError(this.parseErrorBlob));
    }

    /**
     * Converts resource to blob
     * @param resource
     * @param fileType
     * @param fileName
     */
    convertResourceToBlob(resource: SafeAny, fileType: string, fileName: string): void {
        const blob = new Blob([resource], {
            type: fileType,
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);

        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);
    }

    /**
     * Clones file
     * @param file
     * @returns file
     */
    cloneFile(file: File): Observable<File | null> {
        if (!(file && file instanceof File)) {
            return of(null);
        }
        const reader = new FileReader();
        const stream$ = fromEvent(reader, 'loadend');
        reader.readAsArrayBuffer(file);
        return stream$.pipe(
            map(() => {
                const blob = new Blob([reader.result as SafeAny]);
                return new File([blob], file.name, {
                    lastModified: file.lastModified,
                });
            })
        );
    }

    /**
     * Parses error blob
     * @param err
     * @returns error blob
     */
    private parseErrorBlob(err: HttpErrorResponse): Observable<SafeAny> {
        const reader: FileReader = new FileReader();

        const obs = Observable.create((observer: SafeAny) => {
            reader.onloadend = e => {
                observer.error(JSON.parse(reader.result as SafeAny));
                observer.complete();
            };
        });
        reader.readAsText(err.error);
        return obs;
    }
}
