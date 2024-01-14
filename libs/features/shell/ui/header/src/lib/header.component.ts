import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuSelector, MenuStore } from '@asc/features/shell/data-access/state';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'asc-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    readonly pageTilte$ = this.menuSelector.pageTilte$;

    constructor(private menuStore: MenuStore, private menuSelector: MenuSelector, private router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
                this.menuStore.setCurrentUrl(event.url);
            }

            if (event instanceof NavigationError) {
                // Present error to user
                console.warn(event.error);
            }
        });
    }
}
