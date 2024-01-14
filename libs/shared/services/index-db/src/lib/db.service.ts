import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Column } from '@asc/features/shell/data-access/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INDEXED_DB } from '@asc/shared/data-access';

export type ColumnDB = {
    key: string;
    columns: Column[];
};

@Injectable({ providedIn: 'root' })
export class DbService {
    storeSchema = {
        COLUMN: INDEXED_DB.COLUMN_NAME,
    };

    constructor(private dbService: NgxIndexedDBService) {}

    getColumnsCacheByKey(key: string): Observable<Column[]> {
        return this.dbService.getByKey<ColumnDB>(this.storeSchema.COLUMN, key).pipe(map(res => res?.columns));
    }

    addColumnObs(column: ColumnDB): Observable<Column[]> {
        return this.dbService.add(this.storeSchema.COLUMN, column).pipe(map(() => column.columns));
    }

    updateColumnObs(column: ColumnDB): Observable<Column[]> {
        return this.dbService.update(this.storeSchema.COLUMN, column).pipe(map(() => column.columns));
    }

    clearColumnData(): Observable<unknown> {
        return this.dbService.clear(this.storeSchema.COLUMN);
    }
}
