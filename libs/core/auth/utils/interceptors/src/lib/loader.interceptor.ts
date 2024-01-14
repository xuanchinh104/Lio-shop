import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeAny } from '@asc/shared/utils';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '@asc/shared/services/common';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loading: LoadingService) {}

    intercept(req: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
        if (
            req.headers.get('read') === 'true' ||
            (req.body && req.body?.isPreview === true) ||
            req.url.split('/').includes('Files') ||
            req.url.split('/').includes('Media')
        ) {
            return next.handle(req);
        }
        this.loading.setLoading(true, req.url);
        return next.handle(req).pipe(finalize(() => this.loading.setLoading(false, req.url)));
    }
}
