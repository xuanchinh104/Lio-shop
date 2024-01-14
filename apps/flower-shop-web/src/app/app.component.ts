import { Component, Inject, OnInit } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    favIcon = document.querySelector('#appIcon');

    constructor(@Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {}

    ngOnInit(): void {
        if (this.favIcon) {
            (this.favIcon as HTMLLinkElement).href = this.env.favicon;
        }
    }
}
