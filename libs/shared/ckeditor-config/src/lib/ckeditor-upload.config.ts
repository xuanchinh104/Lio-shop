import { Inject } from '@angular/core';
import { JwtService } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

export class CkeditorUploadAdapter {
    loader: any;
    xhr: any;

    constructor(loader: any,
    @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
                private jwtService: JwtService,) {
        this.loader = loader;
    }

    upload(): void {
        return this.loader.file.then(
            (file: any) =>
                new Promise((resolve, reject) => {
                    this._initRequest();
                    this._initListeners(resolve, reject, file);
                    this._sendRequest(file);
                })
        );
    }

    abort(): void {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest(): void {
        const token = this.jwtService.getAccessToken();
        const params: any = {
            moduleName  : 'ckeditor-upload',
            functionName: 'ckeditor-upload',
        };

        const queryString = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const url = `${this.env.apiServer}/api/v1/Media/Files/UploadFiles?${queryString}`;
        const xhr = (this.xhr = new XMLHttpRequest());
        xhr.open('POST', url, true); // TODO change the URL
        xhr.responseType = 'json';
        if (token) {
            xhr.setRequestHeader(
                /* eslint-disable */
                'Authorization',
                'Bearer ' + token
            );
        }
    }

    /* eslint-disable */
    _initListeners(
        resolve: { (value: unknown): void; (arg0: { default: any }): void },
        reject: { (reason?: any): void; (arg0: string | undefined): any },
        file: { name: any }
    ) {
        const xhr = this.xhr;
        const loader = this.loader;
        /* eslint-disable */
        const genericErrorText = `Couldn't upload file: ${file.name}.`;
        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }
            resolve({
                default: `${this.env.apiServer}/${response.result[0].path}`,
            });
        });
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt: { lengthComputable: any; total: any; loaded: any }) => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest(file: string | Blob) {
        const data = new FormData();
        data.append('files', file);
        this.xhr.send(data);
    }
}
