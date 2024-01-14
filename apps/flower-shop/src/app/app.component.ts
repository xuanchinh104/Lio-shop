import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { LANG_ENUM } from '@asc/shared/modules/translate';
import { AuthConfig, JwtService } from '@asc/core/auth/services';
import { StorageService } from '@asc/shared/services/storage';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    favIcon = document.querySelector('#appIcon');

    constructor(
        private translocoService: TranslocoService,
        private storageService: StorageService,
        private jwtService: JwtService,
        private router: Router,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}

    ngOnInit(): void {
        this.onActiveLange();

        if (this.favIcon) {
            (this.favIcon as HTMLLinkElement).href = this.env.favicon;
        }
    }

    ngAfterViewInit(): void {
        const href = window.location.pathname;
        if (['/login', '', '/'].includes(href.toLowerCase()) && this.jwtService.getAccessToken()) {
            void this.router.navigate([environment.redirectUrl]);
        }
    }

    onActiveLange(): void {
        const saveLang = this.storageService.retrieve(AuthConfig.SESSION_LANG) ?? LANG_ENUM.VI;
        this.translocoService.setActiveLang(saveLang as string);
    }
}
