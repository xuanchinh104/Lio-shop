import { HttpClient } from '@angular/common/http';
import { Translation, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

export const LANG_ENUM = {
    VI: 'vi',
    EN: 'en',
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<Translation> {
        return this.http.get<Translation>(`./i18n/${lang}.json`);
    }
}

@NgModule({
    exports: [TranslocoModule],
    providers: [
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: [LANG_ENUM.VI, LANG_ENUM.EN],
                defaultLang: LANG_ENUM.VI,
                fallbackLang: LANG_ENUM.VI,
                missingHandler: {
                    logMissingKey: true,
                },
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                // prodMode            : true
            }),
        },
        {
            provide: TRANSLOCO_LOADER,
            useClass: TranslocoHttpLoader,
        },
    ],
})
export class TranslateModule {}
