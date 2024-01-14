import { Directive, HostListener, Injector, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { GridComponent, GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { ReziseTable } from '@asc/core/constants';
import { State } from '@progress/kendo-data-query';
import { ActionEnum, QueryOption } from '@asc/shared/data-access';
import { DetailExpandEvent } from '@progress/kendo-angular-grid/dist/es2015/rendering/details/detail-expand-event';
import { BaseRolePermission, RoleAction } from '@asc/core/auth/data-access';

@Directive()
export abstract class BaseListComponent<T> extends BaseRolePermission {
    @ViewChild(GridComponent) private gridComp?: GridComponent;
    gridView$!: Observable<GridDataResult>;
    gridState: State = {
        sort: [
            {
                field: 'id',
                dir: 'desc',
            },
        ],
        skip: 0,
        take: 20,
    };

    pageConfig: PagerSettings | false = false;
    selectionIds: number[] = [];

    searchControl = new FormControl();
    isSearchAdvanced = false;
    isSearchFirsttime = false;

    model!: T | null;
    action!: ActionEnum;
    pageHeight = window.innerHeight - ReziseTable;

    rowDetailIndex = -1;
    readonly gridChange$ = new BehaviorSubject<State>(this.gridState);
    readonly refresh$ = new BehaviorSubject(false);
    readonly roleAction = RoleAction;

    protected constructor(injector: Injector) {
        super(injector);
    }

    protected get queryOptions(): QueryOption {
        return {
            pageNumber: this.gridState.take && this.gridState.skip ? this.gridState.skip / this.gridState.take + 1 : 1,
            pageSize: this.gridState.take ?? 0,
            keyword: this.searchControl.value ?? '',
            sortName: this.gridState.sort ? this.gridState.sort[0].field : '',
            sortASC: this.gridState.sort ? this.gridState.sort[0].dir === 'asc' : false,
        };
    }

    @HostListener('window:resize', ['$event']) onResize(event: { target: { innerHeight: number } }): void {
        this.pageHeight = event.target.innerHeight - ReziseTable + 12;
    }

    /**
     * Adds handler
     */
    addHandler(): void {
        this.model = null;
        this.action = ActionEnum.CREATE;
        this.showFormCreateOrUpdate();
    }

    copyHandler(dataItem: T): void {
        this.model = dataItem;
        this.action = ActionEnum.DUPLICATE;
        this.showFormCreateOrUpdate();
    }

    /**
     * Edits handler
     * @param dataItem
     */
    editHandler(dataItem: T): void {
        this.model = dataItem;
        this.action = ActionEnum.UPDATE;
        this.showFormCreateOrUpdate();
    }

    onStateChange(state: State): void {
        this.gridState = state;
        this.gridChange$.next(state);
        this.gridComp?.collapseRow(this.rowDetailIndex);
    }

    onSearchChange(): void {
        this.gridState.skip = 0;
        this.selectionIds = [];

        this.gridChange$.next(this.gridState);
    }

    onDeselectedAll(): void {
        this.selectionIds.length = 0;
    }

    onDetailExpand({ index }: DetailExpandEvent): void {
        if (this.rowDetailIndex > -1) {
            this.gridComp?.collapseRow(this.rowDetailIndex);
        }
        this.rowDetailIndex = index;
    }

    onToggleSearchAdvanced(): void {
        this.isSearchFirsttime = true;
        const el = document.querySelector('.search-backdrop') as HTMLElement;
        this.isSearchAdvanced = !this.isSearchAdvanced;
        if (this.isSearchAdvanced && el) {
            el.classList.add('search-overlay');
        } else {
            if (el) {
                el.classList.remove('search-overlay');
            }
        }
    }

    protected abstract showFormCreateOrUpdate(): void;

    protected abstract getData(keyword: string): Observable<GridDataResult>;
}
