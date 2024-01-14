import { catchError, delay, mapTo } from 'rxjs/operators';
import { merge, Observable, of } from 'rxjs';

export function isLoading(trigger$: Observable<unknown>, content$: Observable<unknown>): Observable<boolean> {
    return merge(
        trigger$.pipe(mapTo(true)),
        content$.pipe(
            delay(0),
            catchError(() => of(false)),
            mapTo(false)
        )
    );
}

export function isError(trigger$: Observable<unknown>, content$: Observable<unknown>): Observable<false | Error> {
    return merge(trigger$, content$).pipe(
        mapTo(false),
        catchError(e => of(e))
    );
}
