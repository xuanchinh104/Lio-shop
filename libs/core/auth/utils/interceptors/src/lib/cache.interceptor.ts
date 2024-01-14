import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';
import { CachingService } from '@asc/shared/services/common';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache = new Map<string, SafeAny>();

    constructor(private cacheService: CachingService) {}

    intercept(request: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
        // Delete cache if no header is set by service's method
        if (!request.headers.get('cache-response')) {
            if (this.cacheService.cacheMap.get(request.urlWithParams)) {
                this.cacheService.cacheMap.delete(request.urlWithParams);
            }

            return next.handle(request);
        }

        // Checked if there is cached data for this URI
        const cachedResponse = this.cacheService.getFromCache(request);
        if (cachedResponse) {
            // In case of parallel requests to same URI,
            // return the request already in progress
            // otherwise return the last cached data
            return of(cachedResponse.clone());
        }

        return next.handle(request).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cacheService.addToCache(request, event);
                }
            })
        );
    }
}
