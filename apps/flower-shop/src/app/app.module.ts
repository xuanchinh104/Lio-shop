import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellModule } from '@asc/features/shell/feature';
import { getAppEnvironmentProvider } from '@asc/shared/app-config';
import { IconModule } from '@asc/shared/ui/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StorageKeyManager } from '@asc/shared/services/storage';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { SnowComponent } from './snow/snow.component';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { INDEXED_DB } from '@asc/shared/data-access';

const dbConfig: DBConfig = {
    name: 'dtnh',
    version: 1,
    objectStoresMeta: [
        {
            store: INDEXED_DB.COLUMN_NAME,
            storeConfig: { keyPath: 'key', autoIncrement: true },
            storeSchema: [],
        },
    ],
};

@NgModule({
    declarations: [AppComponent, SnowComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        IconModule,
        ShellModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [getAppEnvironmentProvider(environment)],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        StorageKeyManager.setPrefix(environment.storageKey);
    }
}
