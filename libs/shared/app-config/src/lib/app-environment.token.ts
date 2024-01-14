import { InjectionToken, ValueProvider } from '@angular/core';
import { AppEnvironment } from './app-environment';

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('asc.environment');

export const getAppEnvironmentProvider = (value: AppEnvironment): ValueProvider => ({
    provide: APP_ENVIRONMENT,
    useValue: value,
});
