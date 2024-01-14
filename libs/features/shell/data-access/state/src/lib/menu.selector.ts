import { Injectable } from '@angular/core';
import { map, publishReplay, refCount, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { MenuStore } from './menu.store';
import { AppModuleTree, ParentModule } from './models';
import { MenuService } from './menu.service';

@Injectable({ providedIn: 'root' })
export class MenuSelector {
    readonly parentModules$ = this.store.parentModules$.pipe(publishReplay(1), refCount());

    readonly modules$ = this.parentModules$.pipe(
        map(rs => {
            const allModule = rs.map(item => item.modules);
            return allModule.reduce((val, current) => val.concat(current), []);
        }),
        shareReplay()
    );

    readonly menuTop$ = this.store.select(s => s.href).pipe(switchMap(rs => this.service.getMenuTops(rs ?? '')));

    readonly pageInfo$ = this.store.select(s => s.href).pipe(switchMap(rs => this.service.getPageInfo(rs ?? '')));

    readonly pageTilte$ = this.pageInfo$.pipe(map(rs => rs?.m_TenModule));

    constructor(private store: MenuStore, private service: MenuService) {}

    getRequestByFilter(filter$: Observable<ParentModule | null>, keyword$: Observable<string>): Observable<AppModuleTree[]> {
        return combineLatest([this.modules$, filter$, keyword$.pipe(startWith(''))]).pipe(
            map(([modules, moduleSelected, keyword]) => {
                if (moduleSelected?.title === 'Tất cả ứng dụng' || !moduleSelected) {
                    return modules.filter(m => m.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
                }

                return moduleSelected?.modules.filter(m => m.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ?? [];
            })
        );
    }
}
