import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Inject, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { ResponseData } from '@asc/shared/data-access';

export abstract class BaseService {
    protected apiUrl?: string;
    protected http: HttpClient;
    protected prefix?: string;

    protected constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        this.http = injector.get(HttpClient);
        this.apiUrl = `${env.apiServer}/api`;
    }

    upload(api: string, data: SafeAny, version = 'v1'): Observable<HttpEvent<any>> {
        const url = `${this.apiUrl}/${version}/${api}`;
        const header = new HttpHeaders({ Read: 'true' });
        const req = new HttpRequest('POST', url, data, {
            headers: header,
            reportProgress: true,
            responseType: 'json',
        });
        return this.http.request(req);
    }

    download(api: string, data: SafeAny, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        return this.http
            .post(url, data, {
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(catchError(this.parseErrorBlob));
    }

    /**
     * Reads api service
     * @param api
     * @param data
     * @param isCache
     * @param version
     * @returns read
     */
    read<T>(api: string, data: SafeAny, isCache = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        let header = new HttpHeaders();
        header = header.append('Read', 'true');
        if (isCache) {
            header = header.set('cache-response', 'true');
        }
        return this.http
            .post<ResponseData<T>>(url, data, {
                headers: header,
            })
            .pipe(map(res => res.result));
    }

    /**
     * Gets http client service
     * @param api
     * @param [params]
     * @param isCache
     * @param version
     * @returns get
     */
    get<T>(api: string, params?: SafeAny, isCache = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        let header = new HttpHeaders();
        header = header.append('Read', 'true');
        if (isCache) {
            header = header.set('cache-response', 'true');
        }
        const options = createRequestOption(params);

        return this.http
            .get<ResponseData<T>>(url, {
                params: options,
                headers: header,
            })
            .pipe(map(res => res.result));
    }

    /**
     * Puts http client service
     * @param api
     * @param data
     * @param isStopLoading
     * @param version
     * @returns put
     */
    put(api: string, data: SafeAny, isStopLoading = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        const header = new HttpHeaders({ Read: isStopLoading ? 'true' : 'false' });
        return this.http.put<ResponseData<SafeAny>>(url, data, {
            headers: header,
        });
    }

    /**
     * Posts http client service
     * @param api
     * @param data
     * @param isStopLoading
     * @param version
     * @returns post
     */
    post(api: string, data: SafeAny, isStopLoading = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        const header = new HttpHeaders({ Read: isStopLoading ? 'true' : 'false' });
        return this.http
            .post<ResponseData<SafeAny>>(url, data, {
                headers: header,
            })
            .pipe(map(res => res.result));
    }

    checkValid(api: string, data: SafeAny, isStopLoading = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        const header = new HttpHeaders({ Read: isStopLoading ? 'true' : 'false' });
        return this.http
            .post<ResponseData<SafeAny>>(url, data, {
                headers: header,
            })
            .pipe(map(res => res.warningMessages));
    }

    /**
     * API delete for single && multiple record
     * @param api
     * @param [body]
     * @param isStopLoading
     * @param version
     * @returns delete
     */
    delete(api: string, body?: SafeAny, isStopLoading = false, version = 'v1'): Observable<SafeAny> {
        const url = `${this.apiUrl}/${version}/${this.prefix}/${api}`;
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Read: isStopLoading ? 'true' : 'false',
            }),
            body,
        };
        return this.http.delete<ResponseData<SafeAny>>(url, options).pipe(map(res => res.result));
    }

    getConfig(version = 'v1'): string {
        return `${this.apiUrl}/${version}/`;
    }

    getUrl(name: string, prefix: string, version = 'v1'): string {
        return `${this.apiUrl}/api/${version}/${prefix}/${name}`;
    }

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

export const createRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
        Object.keys(req).forEach(key => {
            if (req[key] && req[key] instanceof Array) {
                if (req[key] !== undefined && req[key] !== null) {
                    req[key].forEach((item: any) => {
                        options = options.append(`${key.toString()}`, item);
                    });
                }
            } else {
                if (req[key] !== undefined && req[key] !== null) {
                    options = options.set(key, req[key]);
                }
            }
        });
    }

    return options;
};
