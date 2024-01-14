import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '@asc/core/auth/services';
import { map, share } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import { GroupModule } from '@asc/features/system/data-access/models';
import { FormControl } from '@angular/forms';
import { SafeAny } from '@asc/shared/utils';
import { Router } from '@angular/router';
import { MenuSelector, MenuService, ParentModule } from '@asc/features/shell/data-access/state';
import { TokenInfo } from '@asc/core/auth/data-access';

@Component({
    selector: 'ui-dashboard-v2',
    templateUrl: './dashboard-v2.component.html',
    styleUrls: ['./dashboard-v2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2Component {
    tabs: Array<{ name: string; content: string }> = [];
    selectedIndex = 0;
    scrolled = false;

    // GetConfig
    readonly configUI$ = this.dashboardService.configUI$.pipe(share());

    readonly backgroundUrl$ = this.configUI$.pipe(map(rs => rs.banner));

    readonly user$ = this.authService.getUserInfo().pipe(
        map(userInfo => {
            if (!userInfo?.firstname && !userInfo?.lastname) {
                const fetchUserInfo = this.authService.userinfoSSO;
                if (fetchUserInfo) {
                    return {
                        ...userInfo,
                        firstname: fetchUserInfo.first_name,
                        lastname: fetchUserInfo.last_name,
                    } as TokenInfo;
                }
            }

            return userInfo;
        })
    );

    readonly keyword = new FormControl();

    readonly filterModule$ = new BehaviorSubject<ParentModule | null>(null);

    readonly parentModules$ = this.menuSelector.parentModules$;

    readonly data$ = this.menuSelector.getRequestByFilter(this.filterModule$, this.keyword.valueChanges);

    constructor(
        private modal: NzModalService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private dashboardService: DashboardService,
        private menuService: MenuService,
        private menuSelector: MenuSelector,
        private router: Router
    ) {}

    @HostListener('window:scroll', []) onWindowScroll(): void {
        this.scrolled = window.scrollY > 220;
    }

    trackByFunction(index: number, item: SafeAny): number {
        return index;
    }

    redirectModule(menu: GroupModule): void {
        if (menu.url) {
            void this.router.navigate([menu.url]);
        }
    }

    onSelectModule(parentModule: ParentModule): void {
        this.filterModule$.next(parentModule);
        this.keyword.setValue('');
    }

    onNext(): void {
        (document.querySelector('.ant-tabs-nav-wrap') as HTMLElement).classList.replace(
            'ant-tabs-nav-wrap-ping-right',
            'ant-tabs-nav-wrap-ping-left'
        );
        (document.querySelector('.ant-tabs-nav-list') as HTMLElement).style.transform = 'translate(-808px, 0px)';
    }

    onPrevious(): void {
        (document.querySelector('.ant-tabs-nav-wrap') as HTMLElement).classList.replace(
            'ant-tabs-nav-wrap-ping-left',
            'ant-tabs-nav-wrap-ping-right'
        );
        (document.querySelector('.ant-tabs-nav-list') as HTMLElement).style.transform = 'translate(0px, 0px)';
    }
}
