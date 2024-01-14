import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuSelector, MenuService } from '@asc/features/shell/data-access/state';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'asc-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    readonly menuTops$ = this.menuSelector.menuTop$.pipe(
        tap(res => {
            res.forEach(x => {
                const urlPath = x.manHinhs.map(item => item.f_Path);
                if (urlPath.includes(this.router.url)) {
                    x.isActive = true;
                }
            });
        })
    );

    constructor(private menuService: MenuService, private menuSelector: MenuSelector, private router: Router) {}

    onToggleSidebar(): void {
        const layoutMain = document.querySelector('.layout-wrap');
        layoutMain?.classList.toggle('mini-sidebar');
    }

    trackByIndex(index: number): number {
        return index;
    }

    trackByFunc(index: number, elem: any): string {
        return elem.f_Id;
    }
}
