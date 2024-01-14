import { Directive, OnDestroy } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActionEnum, QueryOption } from '@asc/shared/data-access';

export interface NzTableModel {
    id: number;
}

@Directive()
export abstract class BaseNzTableList<T extends NzTableModel> implements OnDestroy {
    model?: T | null;
    action!: ActionEnum;
    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<number>();
    isSubmited = false;

    // ids: number[] = [];

    data: T[] = [];
    rowSelecteds: T[] = [];

    pageNumber = 1;
    pageSize = 20;
    totalItems = 0;

    selectionIds: number[] = [];
    isLoading = false;

    searchControl = new FormControl();
    isSearchAdvanced = false;
    isSearchFirsttime = false;

    protected destroyed$ = new Subject();

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();

        this.onRemoveOverlay();
    }

    onItemChecked(dataItem: T, checked: boolean): void {
        this.updateCheckedSet(dataItem.id, checked);
        this.refreshCheckedStatus();

        if (checked) {
            this.rowSelecteds.push(dataItem);
        } else {
            const findIndex = this.rowSelecteds.findIndex(m => m.id === dataItem.id);
            this.rowSelecteds.splice(findIndex, 1);
        }
    }

    onAllChecked(value: boolean): void {
        this.data.forEach(item => this.updateCheckedSet(item.id, value));
        this.refreshCheckedStatus();

        if (value) {
            this.data.forEach(item => {
                const findIndex = this.rowSelecteds.findIndex(m => m.id === item.id);
                if (findIndex < 0) {
                    this.rowSelecteds.push(item);
                }
            });
        } else {
            this.data.forEach(item => {
                const findIndex = this.rowSelecteds.findIndex(m => m.id === item.id);
                if (findIndex > -1) {
                    this.rowSelecteds.splice(findIndex, 1);
                }
            });
        }
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    refreshCheckedStatus(): void {
        this.checked = this.data.every(item => this.setOfCheckedId.has(item.id));
        this.indeterminate = this.data.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        this.pageSize = params.pageSize;
        this.pageNumber = params.pageIndex;
        this.loadItems().pipe(takeUntil(this.destroyed$)).subscribe();
    }

    onSearchChange(): void {
        this.pageNumber = 1;
        this.isSearchAdvanced = false;
        this.loadItems().pipe(takeUntil(this.destroyed$)).subscribe();
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

    onRemoveOverlay(): void {
        const element = document.querySelector('.search-backdrop') as HTMLElement;
        if (element) {
            this.isSearchAdvanced = false;
            element.classList.remove('search-overlay');
        }
    }

    protected abstract loadItems(): Observable<T[]>;

    get queryOptions(): QueryOption {
        return {
            keyword: this.searchControl.value ?? '',
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
        };
    }
}
