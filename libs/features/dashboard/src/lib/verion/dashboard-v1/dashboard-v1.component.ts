import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { map } from 'rxjs/operators';
import { AppModuleTree, MenuSelector, MenuService, ParentModule } from '@asc/features/shell/data-access/state';

@Component({
    selector: 'ui-dashboard-v1',
    templateUrl: './dashboard-v1.component.html',
    styleUrls: ['./dashboard-v1.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV1Component {
    selectedIndex = 0;

    // GetConfig
    readonly topicUrl$ = this.dashboardService.configUI$.pipe(map(rs => rs.topicImg));

    readonly keyword = new FormControl('');

    readonly filterModule$ = new BehaviorSubject<ParentModule | null>(null);

    readonly parentModules$ = this.menuSelector.parentModules$;

    readonly data$ = this.menuSelector.getRequestByFilter(this.filterModule$, this.keyword.valueChanges);

    constructor(
        private menuService: MenuService,
        private router: Router,
        private menuSelector: MenuSelector,
        private dashboardService: DashboardService
    ) {}

    trackByFunction(index: number): number {
        return index;
    }

    redirectModule(menu: AppModuleTree): void {
        if (menu.url) {
            void this.router.navigate([menu.url]);
        }
    }

    onSelectModule(module: ParentModule, index: number): void {
        this.selectedIndex = index;
        this.filterModule$.next(module);
    }
}
