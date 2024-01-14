import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppModuleTree, MenuService } from '@asc/features/shell/data-access/state';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'asc-app-dock',
    templateUrl: './app-dock.component.html',
    styleUrls: ['./app-dock.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDockComponent {
    isShowApps = false;
    modules$ = this.menuService.getMenuTreeByCurrentUrl().pipe(map(rs => rs?.modules));

    constructor(private menuService: MenuService, private router: Router) {}

    redirectModule(menu: AppModuleTree): void {
        if (menu.url) {
            void this.router.navigate([menu.url]);
        }
    }

    trackByFun(index: number): number {
        return index;
    }
}
