import { Inject, Injectable } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { RbacService } from '@asc/shared/services/common';
import { Observable, of } from 'rxjs';
import { AppMenu, AppMenuTree, MenuConfig, MenuResponse, ParentModule } from './models';
import { tap } from 'rxjs/operators';
import { MenuStore } from './menu.store';
import { StorageService } from '@asc/shared/services/storage';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    menuResponse$!: Observable<MenuResponse>;

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private storage: StorageService,
        private store: MenuStore,
        private rbacService: RbacService
    ) {}

    // Handle temp
    fetchMenu(): Observable<MenuResponse> {
        const responseCached = this.storage.retrieve<MenuResponse>(MenuConfig.KEY_MENU_RESPONSE);
        this.menuResponse$ = responseCached ? of(responseCached) : this.rbacService.get('Menus/GetMenuPage', {});
        return this.menuResponse$.pipe(
            tap(rs => {
                this.setMenuState(rs);

                const parentModules = this.getParentModule(rs.items);
                this.setParentModule(parentModules);
            })
        );
    }

    setMenuState(menuResponse: MenuResponse): void {
        this.storage.store<MenuResponse>(MenuConfig.KEY_MENU_RESPONSE, menuResponse);
        this.storage.store<AppMenu[]>(MenuConfig.KEY_MENU_STORE, menuResponse.items);
        this.store.setMenus(menuResponse.items);
    }

    setParentModule(modules: ParentModule[]): void {
        this.storage.store<ParentModule[]>(MenuConfig.KEY_MENU_GROUP, modules);
        this.store.setParentModule(modules);
    }

    getMenuTops(url: string): Observable<AppMenuTree[]> {
        if (!url) {
            url = window.location.pathname;
        }
        const appMenus = this.storage.retrieve<AppMenu[]>(MenuConfig.KEY_MENU_STORE) ?? [];
        const appMenu = appMenus.find(m => m.f_Path === url) ?? null;
        if (!appMenu) {
            return of([]);
        }

        const menus = appMenus.filter(m => m.m_KeyModule === appMenu.m_KeyModule);
        const menuTrees = this.getAppMenuTree(menus);
        this.store.setMenuTops(menuTrees);

        return of(menuTrees);
    }

    hasKeyPermission(key: string): boolean {
        const options = this.storage.retrieve<MenuResponse>(MenuConfig.KEY_MENU_RESPONSE)?.options;
        if (options && options.length > 0) {
            return options.map(m => m.key).includes(key);
        }
        return false;
    }

    hasPermissionCRUD(url: string): number[] {
        const items = this.storage.retrieve<MenuResponse>(MenuConfig.KEY_MENU_RESPONSE)?.items;
        return items?.filter(m => m.f_Path === url && m.fG_CssBadge !== 'ONLY_ONE').map(m => m.a_ActionType) as number[];
    }

    getPageInfo(url: string): Observable<AppMenu | null> {
        if (!url) {
            url = window.location.pathname;
        }
        const appMenus = this.storage.retrieve<AppMenu[]>(MenuConfig.KEY_MENU_STORE) ?? [];
        const appMenu = appMenus.find(m => m.f_Path === url) ?? null;

        return of(appMenu);
    }

    getMenuTreeByCurrentUrl(): Observable<ParentModule | null> {
        const appMenus = this.storage.retrieve<AppMenu[]>(MenuConfig.KEY_MENU_STORE) ?? [];
        const curentPage = appMenus.find(m => m.f_Path === window.location.pathname);
        if (!curentPage) {
            return of(null);
        }

        const menus = appMenus.filter(m => m.m_KeyModule === curentPage.m_KeyModule);
        const menuTrees = this.getAppMenuTree(menus);

        // set menuTops
        this.store.setPageTitle(curentPage.m_TenModule);
        this.store.setMenuTops(menuTrees);

        const parentModules = this.storage.retrieve<ParentModule[]>(MenuConfig.KEY_MENU_GROUP);
        if (!parentModules) {
            return of(null);
        }

        const appModules = parentModules.find(m => m.title === curentPage.m_GroupName) ?? null;
        return of(appModules);
    }

    getMenuGroupByTitle(keyword: string): ParentModule | null {
        const storage = this.storage.retrieve<ParentModule[]>(MenuConfig.KEY_MENU_GROUP);
        if (!storage) {
            return null;
        }
        return storage.find(m => m.title === keyword) ?? null;
    }

    clearState(): void {
        this.storage.clear(MenuConfig.KEY_MENU_RESPONSE);
        this.storage.clear(MenuConfig.KEY_MENU_STORE);
        this.storage.clear(MenuConfig.KEY_MENU_GROUP);
    }

    private getAppMenuTree(appMenus: AppMenu[]): AppMenuTree[] {
        const groupByFID = getDataByKey(appMenus, 'f_Id');
        const functionList = groupByFID.map(item => ({
            ...item.value[0],
            actions: item.value.map((m: AppMenu) => m.a_ActionType),
        }));
        return getDataByKey(functionList, 'f_ParentId')
            .map(item => {
                const firstItem = item.value[0];
                return {
                    title: firstItem?.fG_Name,
                    order: firstItem?.fG_Order,
                    url: firstItem?.fG_Path,
                    cssBadge: firstItem?.fG_Css,
                    manHinhs: item.value.sort((current: AppMenu, next: AppMenu) => current.f_Order - next.f_Order),
                    isMainMenu: firstItem?.fG_CssBadge === 'ONLY_ONE',
                };
            })
            .sort((a, b) => a.order - b.order);
    }

    private getParentModule(appMenus: AppMenu[]): ParentModule[] {
        // sort menus
        appMenus = appMenus.sort((current, next) => current.m_SoThuTu - next.m_SoThuTu || current.fG_Order - next.fG_Order);

        const parentModules = getDataByKey(appMenus, 'm_GroupName');
        return parentModules.map(item => ({
            title: item.key,
            modules: getDataByKey(item.value, 'm_KeyModule').map(mod => {
                const firstItem = mod.value.length > 0 ? mod.value[0] : null;
                return {
                    title: firstItem?.m_TenModule,
                    desc: firstItem?.m_MoTa,
                    url: firstItem?.f_Path ?? firstItem?.fG_Path,
                    icon: `/assets/images/dashboard/${firstItem.m_CssClass}`,
                    shadow: firstItem.m_CssIcon,
                    manHinhs: mod.value,
                };
            }),
        }));
    }
}

export function groupArrayOfObjects<T>(list: T[], key: string): any {
    return list.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export function getDataByKey(collection: Array<any>, property = 'date'): any[] {
    if (!collection) {
        return [];
    }

    const groupedCollection = collection.reduce((previous, current) => {
        if (!previous[current[property]]) {
            previous[current[property]] = [current];
        } else {
            previous[current[property]].push(current);
        }

        return previous;
    }, {});

    return Object.keys(groupedCollection).map(key => ({
        key,
        value: groupedCollection[key],
    }));
}
