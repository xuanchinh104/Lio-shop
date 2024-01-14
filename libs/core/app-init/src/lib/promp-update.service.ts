import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { Inject, Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DbService } from '@asc/shared/services/index-db';

@Injectable({
    providedIn: 'root',
})
export class PromptUpdateService {
    constructor(private updates: SwUpdate, @Inject(DOCUMENT) private readonly document: Document, private dbService: DbService) {}

    forceUpdate(): Observable<UpdateAvailableEvent | null> {
        if (!this.updates.isEnabled) {
            return of(null);
        }
        return this.updates.available.pipe(
            switchMap(version =>
                this.dbService.clearColumnData().pipe(
                    map(() => version),
                    tap(v => {
                        this.updates.activateUpdate().then(() => {
                            console.warn(`[ASC] PWA is updating from ${v.current.hash} to ${v.available.hash}...`);
                            if (confirm(`Hệ thống vừa cập nhật phiên bản mới, vui lòng click vào đây để cập nhật !`)) {
                                this.document.location.reload();
                            }
                        });
                    })
                )
            )
        );
    }
}
