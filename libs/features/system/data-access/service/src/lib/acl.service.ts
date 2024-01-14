import { Inject, Injectable, Injector } from '@angular/core';
import { ApiService } from '@asc/shared/services/common';
import { PrefixService } from '@asc/core/constants';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';
import { AclConstant } from '@asc/features/system/data-access/models';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Injectable({
    providedIn: 'root',
})
export class AclService extends ApiService {
    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);
        this.prefix = PrefixService.ACL;
    }

    getModules(body: SafeAny): Observable<any[]> {
        return this.post(AclConstant.ACL_MODULE + '/GetList', body, true).pipe(
            map(res => res.items),
            shareReplay(1)
        );
    }
}
