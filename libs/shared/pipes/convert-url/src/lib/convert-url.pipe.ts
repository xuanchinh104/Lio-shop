import { Inject, Pipe, PipeTransform } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Pipe({
    name: 'convertUrl',
})
export class ConvertUrlPipe implements PipeTransform {
    constructor(@Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {}
    transform(url: string): string {
        return this.env.mediaServer + '/' + url;
    }
}
