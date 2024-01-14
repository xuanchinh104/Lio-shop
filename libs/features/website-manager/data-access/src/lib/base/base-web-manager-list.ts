import { Directive, Injector } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@asc/shared/services/common';
import { Title } from '@angular/platform-browser';
import {
    catchError,
    debounceTime,
    delay,
    map,
    publishReplay,
    refCount,
    share,
    shareReplay,
    startWith,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { isError, isLoading } from '@asc/shared/utils';
import { BaseListComponent } from '@asc/shared/base';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { MessageConstant, PageConfig } from '@asc/core/constants';
import { Column, COLUMN_KEY } from '@asc/features/shell/data-access/state';
import { ColumnDB, DbService } from '@asc/shared/services/index-db';
import { StorageService } from '@asc/shared/services/storage';
import { TranslocoService } from '@ngneat/transloco';

@Directive()
export abstract class BaseWebManagerList<T> extends BaseListComponent<T> {
    columnKey!: string;
    columnDefault!: Column[];
    column!: Column;
    columnLocked: Column[] = [];

    columnDelete!: string[];

    visible = false;
    isSaveOrDefault = false;
    isLocked = false;

    readonly search$ = this.searchControl.valueChanges.pipe(startWith(''), debounceTime(500));

    readonly trigger$ = combineLatest([this.search$, this.gridChange$, this.refresh$]).pipe(shareReplay());
    readonly empty$ = new BehaviorSubject<boolean>(true);
    readonly request$ = this.trigger$.pipe(
        switchMap(([keyword]) =>
            this.getData(keyword).pipe(
                tap(res => {
                    if (res.total > 0) {
                        this.empty$.next(false);
                    }
                })
            )
        ),
        shareReplay()
    );
    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly error$ = isError(this.trigger$, this.request$);

    readonly total$ = this.request$.pipe(
        map(item => item.total),
        startWith(-1),
        share()
    );

    readonly isSkeleton$ = this.total$.pipe(
        take(2),
        map(total => total < 0),
        catchError(err => of(false))
    );

    readonly pageSetting$: Observable<PagerSettings | false> = this.total$.pipe(
        map(total => (total > (this.gridState.take ?? 0) ? PageConfig : false))
    );

    readonly gridView$ = this.request$.pipe(delay(0));

    // setting view
    readonly triggerColumn$ = new BehaviorSubject<string>('');

    readonly refreshList$ = new BehaviorSubject(false);

    readonly pinColumn$ = new BehaviorSubject<Column>(this.column);

    readonly state$ = combineLatest([this.pinColumn$, this.triggerColumn$, this.refreshList$]).pipe(publishReplay(1), refCount());

    readonly requestColumn$ = this.state$.pipe(
        switchMap(([column]) => {
            if (!window.indexedDB) {
                return this.getColumnsByLocalStorage(this.columnKey, column);
            } else {
                return this.getColumn(this.columnKey, column);
            }
        }),
        shareReplay()
    );

    readonly columnKendo$ = this.requestColumn$.pipe(
        delay(0),
        tap(res => {
            this.isLocked = res.filter(item => item.isLocked).length > 0;
            this.columnLocked = res.filter(x => x.isChecked).filter(x => !x.isLocked);
            this.columnDelete = res.filter(m => !m.isChecked).map(y => y.field);
        })
    );

    readonly isPinColumn$ = this.requestColumn$.pipe(map(rs => rs.filter(item => item.isChecked).length === 1));

    protected modal: NzModalService;
    protected notification: NotificationService;
    protected titleService: Title;
    protected dbService: DbService;
    protected storage: StorageService;
    protected translocoService: TranslocoService;

    protected constructor(injector: Injector) {
        super(injector);
        // inject
        this.dbService = injector.get(DbService);
        this.modal = injector.get(NzModalService);
        this.notification = injector.get(NotificationService);
        this.titleService = injector.get(Title);
        this.storage = injector.get(StorageService);
        this.translocoService = injector.get(TranslocoService);
    }

    pinColumn(column: Column): void {
        this.isSaveOrDefault = false;
        this.pinColumn$.next(column);
    }

    onSaveSetting(col: Column[]): void {
        this.isSaveOrDefault = true;
        this.refreshList$.next(true);
    }

    closeSetting(isClose: boolean): void {
        this.visible = isClose;
    }

    refreshView(): void {
        this.searchControl.setValue('');
    }

    trackByColumn(index: number, item: Column): string {
        return item.field;
    }

    protected getColumnsByLocalStorage(key: string, col: Column): Observable<Column[]> {
        const data = this.storage.retrieve<ColumnDB[]>(COLUMN_KEY.COLUMN_KEY) ?? [];
        const newArray = data.filter(x => x.key === key);
        if (data && data.length > 0 && newArray.length > 0) {
            if (col && !this.isSaveOrDefault) {
                const index = newArray[0].columns.findIndex(x => x.field === col.field);
                if (this.columnLocked.length === 1 && !newArray[0].columns[index].isLocked) {
                    this.notification.showWarningMessage(MessageConstant.COMMON.MSG_LAST_COLUMN_CANNOT_PINNED);
                } else {
                    newArray[0].columns[index].isLocked = !newArray[0].columns[index].isLocked;
                    const indexData = data.findIndex(x => x.key === newArray[0].key);
                    data[indexData] = newArray[0];
                    this.storage.store(COLUMN_KEY.COLUMN_KEY, data);
                }
            }
            return of(newArray[0].columns);
        } else {
            const arr = [];
            if (data.length > 0) {
                data.push({
                    key,
                    columns: this.columnDefault,
                });
                this.storage.store(COLUMN_KEY.COLUMN_KEY, data);
            } else {
                arr.push({
                    key,
                    columns: this.columnDefault,
                });
                this.storage.store(COLUMN_KEY.COLUMN_KEY, arr);
            }

            return of(this.columnDefault);
        }
    }

    protected getColumn(key: string, col: Column): Observable<Column[]> {
        return this.dbService.getColumnsCacheByKey(key).pipe(
            switchMap(columns => {
                if (columns && columns.length > 0) {
                    if (col && !this.isSaveOrDefault) {
                        const index = columns.findIndex(x => x.field === col.field);
                        if (this.columnLocked.length === 1 && !columns[index].isLocked) {
                            this.notification.showWarningMessage(MessageConstant.COMMON.MSG_LAST_COLUMN_CANNOT_PINNED);
                        } else {
                            columns[index].isLocked = !columns[index].isLocked;
                            return this.dbService.updateColumnObs({
                                key,
                                columns: [...columns],
                            });
                        }
                    }
                    return of(columns);
                }
                return this.dbService.addColumnObs({
                    key,
                    columns: [...this.columnDefault],
                });
            }),
            catchError(() => this.getColumnsByLocalStorage(key, col))
        );
    }
}
