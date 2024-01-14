import { Directive, Injector } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, debounceTime, delay, map, share, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { combineLatest, Observable, of } from 'rxjs';
import { isError, isLoading } from '@asc/shared/utils';
import { BaseListComponent } from '@asc/shared/base';
import { PageConfig } from '@asc/core/constants';
import { PagerSettings } from '@progress/kendo-angular-grid';

@Directive()
export abstract class BaseConfigurationListComponent<T> extends BaseListComponent<T> {
    readonly search$ = this.searchControl.valueChanges.pipe(startWith(''), debounceTime(500));

    readonly trigger$ = combineLatest([this.search$, this.gridChange$, this.refresh$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([keyword]) => this.getData(keyword)),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly error$ = isError(this.trigger$, this.request$);

    readonly total$ = this.request$.pipe(
        map(item => item.total),
        startWith(-1),
        share()
    );

    readonly empty$ = this.total$.pipe(
        take(2),
        startWith(0),
        map(total => total < 1)
    );

    readonly isSkeleton$ = this.total$.pipe(
        take(2),
        map(total => total < 0),
        catchError(err => of(false))
    );

    readonly gridView$ = this.request$.pipe(delay(0));

    readonly pageSetting$: Observable<PagerSettings | false> = this.total$.pipe(
        map(total => (total > (this.gridState.take ?? 0) ? PageConfig : false))
    );

    protected modal: NzModalService;
    protected titleService: Title;

    protected constructor(injector: Injector) {
        super(injector);

        // inject
        this.modal = injector.get(NzModalService);
        this.titleService = injector.get(Title);
    }
}
