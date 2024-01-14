import { Inject, Injectable, Injector } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { ConfigWeb } from '@asc/web/shell/data-access/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { BaseWebService } from './common/base-web.service';

@Injectable({
    providedIn: 'root',
})
export class SettingService extends BaseWebService {
    configWebs$ = new BehaviorSubject<ConfigWeb[]>([]);

    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);
    }

    getConfigWeb(): Observable<ConfigWeb[]> {
        return this.get(CourseWebConstant.SETTING_FOR_WEB + '/CauHinh').pipe(
            tap(rs => this.configWebs$.next(rs)),
            shareReplay()
        );
    }

    getValueByKey(key: string): Observable<string | null> {
        return this.configWebs$.pipe(map(rs => rs.find(item => item.keyCauHinh === key)?.valueCauHinh ?? null));
    }
}
