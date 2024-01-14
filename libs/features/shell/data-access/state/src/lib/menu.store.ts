import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppMenu, AppMenuTree, ParentModule } from './models/menu.model';
import { map, startWith } from 'rxjs/operators';

export interface MenuState {
    menus: AppMenu[];
    parentModules: ParentModule[];
    menuTops: AppMenuTree[]; // show header
    pageTitle: string | null;
    appMenu: AppMenu | null;
    href: string | null;
}

const initialState = {
    menus: [],
    parentModules: [],
    menuTops: [],
    pageTitle: null,
    appMenu: null,
    href: null,
};

@Injectable({ providedIn: 'root' })
export class MenuStore extends ComponentStore<MenuState> {
    readonly menus$ = this.select(s => s.menus);

    readonly menuTops$ = this.select(s => s.menuTops);

    readonly pageTitle$ = this.select(s => s.pageTitle).pipe(startWith('Đào tạo ngắn hạn'));

    readonly parentModules$ = this.select(s => s.parentModules).pipe(
        map(rs => {
            rs.unshift({
                title: 'Tất cả ứng dụng',
                modules: [],
            });
            return rs;
        })
    );

    constructor() {
        super(initialState);
    }

    setMenus(menus: AppMenu[]): void {
        this.patchState({ menus });
    }

    setPageTitle(pageTitle: string): void {
        this.patchState({ pageTitle });
    }

    setMenuTops(menuTops: AppMenuTree[]): void {
        this.patchState({ menuTops });
    }

    setParentModule(parentModules: ParentModule[]): void {
        this.patchState({ parentModules });
    }

    setCourseMenu(appMenu: AppMenu): void {
        this.patchState({ appMenu });
    }

    setCurrentUrl(href: string): void {
        this.patchState({ href });
    }
}
