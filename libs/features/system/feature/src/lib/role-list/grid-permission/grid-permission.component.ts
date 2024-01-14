import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';
import {
    AclConstant,
    LoaiBoSungQuyenEnum,
    LoaiKeThuaQuyenEnum,
    LoaiThuHoiQuyenEnum,
    RoleOfList,
} from '@asc/features/system/data-access/models';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { isLoading, SafeAny } from '@asc/shared/utils';
import { ReziseTable } from '@asc/core/constants';
import { ModulePermission, PermissionService } from '@asc/features/system/data-access/service';
import { GridComponent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'asc-grid-permission',
    templateUrl: './grid-permission.component.html',
    styleUrls: ['./grid-permission.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PermissionService],
})
export class GridPermissionComponent implements OnDestroy {
    @ViewChild(GridComponent) gridPermission?: GridComponent;
    _role: RoleOfList | null = null;
    @Input() set role(value: RoleOfList) {
        if (value) {
            this._role = value;
            this.permissionService.setRoleId(this._role.id);
        }
    }

    @Output() back = new EventEmitter();

    isCurrentUser = false;
    moduleChecked = false;
    pageHeight = window.innerHeight - ReziseTable;
    isSubmited = false;
    arrayGroupChecked: string[] = [];

    readonly modelOptional = {
        typeOfAddition: LoaiBoSungQuyenEnum.KhongApDung,
        typeOfWithdraw: LoaiThuHoiQuyenEnum.ThuHoiTatCa,
        typeOfInherited: LoaiKeThuaQuyenEnum.KhongApDung,
    };

    readonly groups: GroupDescriptor[] = [{ field: 'fG_Name' }];

    readonly parentModule$ = this.permissionService.parentModule$.pipe(
        tap(rs => {
            const focusModule = rs[0].childs[0];
            this.permissionService.moduleSelected$.next(focusModule);
        })
    );

    readonly module$ = this.permissionService.moduleSelected$.pipe(shareReplay());

    readonly functionGroupChanged$ = new BehaviorSubject<any>(null);

    readonly gridView$ = this.permissionService.getDataByKey().pipe(
        map(rs => process(rs, { group: this.groups })),
        map(rs => ({
            data: rs.data.map(item => {
                const itemInGroup = item.items[0];
                return {
                    ...item,
                    isChecked: this.arrayGroupChecked.includes(itemInGroup.fG_Id) ?? false,
                };
            }),
            total: rs.total,
        })),
        shareReplay()
    );
    readonly isLoading$ = isLoading(this.permissionService.trigger$, this.gridView$).pipe(take(3));

    private destroyed$ = new Subject();

    constructor(
        private permissionService: PermissionService,
        private rbacService: RbacService,
        private notification: NotificationService,
        private cdr: ChangeDetectorRef
    ) {}

    @HostListener('window:resize', ['$event']) onResize(event: { target: { innerHeight: number } }): void {
        this.pageHeight = event.target.innerHeight - ReziseTable + 12;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();

        this.permissionService.setModuleSelected(null);
    }

    rollBackView(): void {
        this.back.emit();
    }

    onCheckAll(checked: boolean, module: ModulePermission): void {
        // code here
        this.permissionService.setCheckAll(checked, module);
    }

    trackByFunc(index: number): number {
        return index;
    }

    /**
     * Trees click
     * @param module
     */
    onSelectModule(module: ModulePermission): void {
        this.moduleChecked = false;
        this.permissionService.setModuleSelected(module);
    }

    collapseGroups(grid: SafeAny): void {
        this.gridView$.pipe().subscribe(gridViewData => {
            if (gridViewData && Array.isArray(gridViewData.data)) {
                gridViewData.data.forEach((child, index) => {
                    grid.collapseGroup(index.toString());
                    child.items.forEach((_: any, idx: any) => grid.collapseGroup(`${index}_${idx}`));
                });
            }
        });
    }

    /**
     * Expands groups header
     */
    expandGroups(grid: SafeAny): void {
        this.gridView$.pipe().subscribe(gridViewData => {
            if (gridViewData && Array.isArray(gridViewData.data)) {
                gridViewData.data.forEach((child, index) => {
                    grid.expandGroup(index.toString());
                    child.items.forEach((_: any, idx: any) => grid.expandGroup(`${index}_${idx}`));
                });
            }
        });
    }

    savePermission(): void {
        this.isSubmited = true;
        this.permissionService.permissions$
            .pipe(
                map(permissions => {
                    const optional: string[] = [];
                    permissions.forEach(item => {
                        if (item.listOfOption) {
                            item.listOfOption
                                .filter(m => m.isCheck)
                                .forEach(option => {
                                    optional.push(option.a_Id);
                                });
                        }
                    });

                    return {
                        ...this.modelOptional,
                        idSelected: <string>this._role?.id,
                        arrIdInherited: [],
                        arrAclView: permissions.filter(m => m.isView).map(m => m.f_Id),
                        arrAclAdd: permissions.filter(m => m.isAdd).map(m => m.f_Id),
                        arrAclEdit: permissions.filter(m => m.isEdit).map(m => m.f_Id),
                        arrAclDelete: permissions.filter(m => m.isDelete).map(m => m.f_Id),
                        arrAclOption: optional,
                    };
                }),
                take(1),
                switchMap(request => this.rbacService.put(AclConstant.ACL_ROLE_ACTION, request))
            )
            // takeUntil(this.destroyed$))
            .subscribe(
                rs => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                    this.notification.showSuccessMessage('Cập nhật quyền thành công');
                },
                () => {
                    this.isSubmited = false;
                }
            );
    }

    setPermission(checked: boolean, dataItem: SafeAny): void {
        this.permissionService.functionGroupChaneged$.next(null);
        this.permissionService.roleActionChanged$.next(dataItem);
    }

    /**
     * Sets permission of group
     * @param checked
     * @param dataItem
     */
    setPermissionOfGroup(checked: boolean, dataItem: SafeAny): void {
        const fG_Id = dataItem.items[0].fG_Id;
        if (checked) {
            this.arrayGroupChecked.push(fG_Id);
        } else {
            const index = this.arrayGroupChecked.findIndex(m => m === fG_Id);
            this.arrayGroupChecked.splice(index, 1);
        }
        this.permissionService.roleActionChanged$.next(null);
        this.permissionService.functionGroupChaneged$.next(dataItem);
    }
}
