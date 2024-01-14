import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { delay, map, publishReplay, refCount, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { groupBy, GroupDescriptor, GroupResult } from '@progress/kendo-data-query';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { CheckableSettings, NodeClickEvent } from '@progress/kendo-angular-treeview';
import { SafeAny } from '@asc/shared/utils';
import { FormConfigurationComponent } from '../form-configuration/form-configuration.component';
import { ActionEnum } from '@asc/shared/data-access';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { MenuSelector } from '@asc/features/shell/data-access/state';
import { SharedConfigurationService } from '@asc/features/configuration/service';
import { Configuration, ConfigurationConstant, TreeView } from '@asc/features/configuration/data-access';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewComponent {
    readonly trigger$ = new BehaviorSubject<string>('');

    readonly refresh$ = new BehaviorSubject(false);

    readonly state$ = combineLatest([this.trigger$, this.refresh$]).pipe(publishReplay(1), refCount());

    readonly request$ = this.state$.pipe(
        switchMap(() => this.getTreeView()),
        shareReplay()
    );

    readonly treeView$ = this.request$.pipe(
        delay(100),
        tap(() => {
            this.expandedKeys = ['r_0'];
        }),
        shareReplay()
    );

    readonly pageInfo$ = this.menuSelector.pageInfo$;

    groups: GroupDescriptor[] = [
        {
            field: 'groupName',
        },
    ];

    itemClick!: SafeAny;
    key = 'value';
    expandedKeys: string[] = [];
    selectedKeys: string[] = [];
    checkedKeys: number[] = [];
    selectionIds: number[] = [];

    dataItem!: Configuration;

    private _isMultiple = false;
    private destroyed$ = new Subject();

    constructor(
        private modal: NzModalService,
        private rbacService: RbacService,
        private nzContextMenuService: NzContextMenuService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef,
        private menuSelector: MenuSelector,
        private sharedConfigurationService: SharedConfigurationService,
        private translocoService: TranslocoService
    ) {}

    hasChildren = (item: SafeAny): boolean => item.childrens && item.childrens.length > 0;

    treeClick(e: NodeClickEvent): void {
        this.itemClick = e;
        if (!this.itemClick.item?.dataItem?.key) {
            this.dataItem = e.item?.dataItem;
            this.sharedConfigurationService.setModuleSelected(this.dataItem.id);
        }
    }

    contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
        if (!this.itemClick.item?.dataItem?.key) {
            this.nzContextMenuService.create($event, menu);
        }
    }

    getAllParentTextProperties(items: Array<SafeAny>): void {
        items.forEach(i => {
            if (i.key) {
                this.expandedKeys.push(i.groupName);
                this.getAllParentTextProperties(i.children);
            }
        });
    }

    editNode(): void {
        if (this.dataItem) {
            const modal = this.modal.create({
                nzContent: FormConfigurationComponent,
                nzComponentParams: {
                    formState: {
                        action: ActionEnum.UPDATE,
                        data: <Configuration>this.dataItem,
                    },
                },
                nzWidth: 550,
                nzFooter: null,
                nzMaskClosable: false,
                nzClosable: false,
            });
            modal.afterClose.subscribe((isLoad: boolean) => {
                if (isLoad) {
                    this.refresh$.next(true);
                }
            });
        }
    }

    removeNode(): void {
        if (this.dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(this.dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            this.modal.confirm({
                nzTitle: this.translocoService.translate('CF.TITLE'),
                nzContent: this.translocoService.translate('WR.XAC_NHAN_XOA'),
                nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
                nzOkDanger: true,
                nzOnOk: () => {
                    this.rbacService
                        .delete(ConfigurationConstant.MODULE, {
                            ids: this.selectionIds,
                        })
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                            this.refresh$.next(true);
                            this.selectionIds = [];
                        });
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    addHandler(): void {
        const modal = this.modal.create({
            nzContent: FormConfigurationComponent,
            nzComponentParams: {
                formState: {
                    action: ActionEnum.CREATE,
                    data: null,
                },
            },
            nzWidth: 550,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(true);
            }
        });
    }

    get checkableSettings(): CheckableSettings {
        return {
            checkChildren: false,
            checkParents: false,
            enabled: this._isMultiple,
            checkOnClick: false,
        };
    }

    private getTreeView(): Observable<TreeView[]> {
        return this.rbacService
            .get(ConfigurationConstant.MODULE_LIST, {
                pageNumber: 1,
                pageSize: 100,
                sortName: 'id',
                sortASC: false,
                isActive: true,
            })
            .pipe(
                map(rs => rs.items ?? []),
                map(rs => {
                    const groupResult = groupBy(rs, this.groups) as GroupResult[];
                    return groupResult.map((item, index) => ({
                        key: `g_${index + 1}`,
                        groupName: item.value as string,
                        children: item.items as TreeView[],
                    }));
                }),
                map(rs => [
                    {
                        key: 'r_0',
                        groupName: 'Phân hệ',
                        children: rs,
                    },
                ])
            );
    }
}
