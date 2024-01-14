import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ThemeUIEnum } from './dashboard.enum';
import { map } from 'rxjs/operators';
import { MenuService } from '@asc/features/shell/data-access/state';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'ui-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
    // GetConfig
    fetchMenu$ = this.menuService.fetchMenu();

    configUI$ = combineLatest([this.dashboardService.configUI$, this.fetchMenu$]).pipe(map(([configUIs]) => configUIs));

    themeUIEnum = ThemeUIEnum;

    constructor(private dashboardService: DashboardService, private menuService: MenuService) {}
}
