import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PromptUpdateService } from './promp-update.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { AppInit } from './app-init.action';

@Injectable()
export class ApplicationEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private googleAnalytics: GoogleAnalyticsService,
        private promptUpdate: PromptUpdateService
    ) {}

    initAuth$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AppInit),
                tap(() => {
                    // this.authStore.init();
                })
            ),
        {
            dispatch: false,
        }
    );

    sendGoogleAnalyticPageView$ = createEffect(
        () =>
            this.router.events.pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                tap(event => {
                    this.googleAnalytics.sendPageView(event.urlAfterRedirects);
                })
            ),
        {
            dispatch: false,
        }
    );

    initForceUpdate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AppInit),
                switchMap(() => this.promptUpdate.forceUpdate())
            ),
        {
            dispatch: false,
        }
    );
}
