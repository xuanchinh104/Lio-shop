import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuSelector } from '@asc/features/shell/data-access/state';
import { Router } from '@angular/router';
import { MenuSidebar } from '@asc/shared/data-access';

@Component({
    selector: 'asc-menu-horizontal',
    templateUrl: './menu-horizontal.component.html',
    styleUrls: ['./menu-horizontal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent {
    readonly menuTops$ = this.menuSelector.menuTop$;

    constructor(private menuSelector: MenuSelector, private router: Router) {}

    link(menus: MenuSidebar): void {
        if (!(menus.subMenu && menus.subMenu.length > 0 && menus.cssBadge !== 'ONLY')) {
            void this.router.navigate([menus.link]);
        }
    }

    trackByFunc(index: number): number {
        return index;
    }
}
