import { Injectable } from '@angular/core';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
    AclConstant,
    LoaiBoSungQuyenEnum,
    LoaiKeThuaQuyenEnum,
    LoaiThuHoiQuyenEnum,
    RoleAction,
    RoleOptionSelected,
} from '@asc/features/system/data-access/models';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { RbacService } from '@asc/shared/services/common';

export interface ParentModulePermission {
    groupName: string;
    childs: ModulePermission[];
}

export interface ModulePermission {
    key: string;
    icon: string;
    value: string;
    desc: string;
    group: string;
}

@Injectable()
export class PermissionService {
    readonly modelOptional = {
        typeOfAddition: LoaiBoSungQuyenEnum.KhongApDung,
        typeOfWithdraw: LoaiThuHoiQuyenEnum.ThuHoiTatCa,
        typeOfInherited: LoaiKeThuaQuyenEnum.KhongApDung,
    };

    readonly idRole$ = new BehaviorSubject('');
    readonly moduleSelected$ = new BehaviorSubject<ModulePermission | null>(null);
    readonly checkAll$ = new BehaviorSubject<boolean | null>(null);
    readonly roleActionChanged$ = new BehaviorSubject<RoleAction | null>(null);
    readonly functionGroupChaneged$ = new BehaviorSubject<any | null>(null);

    readonly roleOptions$ = this.idRole$.pipe(
        switchMap(idRole => this.getRoleOption(idRole)),
        shareReplay()
    );

    readonly roleActions$: Observable<RoleAction[]> = this.rbacService.get(AclConstant.ACL_ROLE_ACTION + '/ListOfRoleAction', {}).pipe(
        map(rs =>
            rs.map((roleAction: RoleAction) => {
                roleAction.state = false;
                if (roleAction.isView !== null) {
                    roleAction.isView = false;
                }

                if (roleAction.isAdd !== null) {
                    roleAction.isAdd = false;
                }

                if (roleAction.isEdit !== null) {
                    roleAction.isEdit = false;
                }

                if (roleAction.isDelete !== null) {
                    roleAction.isDelete = false;
                }
                roleAction.isHasRole = false;
                if (roleAction.listOfOption && roleAction.listOfOption.length > 0) {
                    roleAction.listOfOption.forEach(c => {
                        if (c.isCheck !== null) {
                            c.isCheck = false;
                        }
                    });
                }
                return roleAction;
            })
        ),
        shareReplay()
    );

    readonly triggerPerrmission$ = combineLatest([this.roleActions$, this.roleOptions$]).pipe(shareReplay());

    readonly permissions$ = this.triggerPerrmission$.pipe(
        map(([roleActions, roleOptions]) =>
            roleActions.map(item => {
                if (item.isView !== null) {
                    item.isView = roleOptions ? roleOptions.arrAclView.includes(item.f_Id) : false;
                }

                if (item.isAdd !== null) {
                    item.isAdd = roleOptions ? roleOptions.arrAclAdd.includes(item.f_Id) : false;
                }

                if (item.isEdit !== null) {
                    item.isEdit = roleOptions ? roleOptions.arrAclEdit.includes(item.f_Id) : false;
                }

                if (item.isDelete !== null) {
                    item.isDelete = roleOptions ? roleOptions.arrAclDelete.includes(item.f_Id) : false;
                }
                item.isHasRole = false;
                if (item.listOfOption && item.listOfOption.length > 0) {
                    item.listOfOption.forEach(c => {
                        if (c.isCheck !== null) {
                            c.isCheck = roleOptions ? roleOptions.arrAclOption.includes(c.a_Id) : false;
                        }
                    });
                }

                return {
                    ...item,
                };
            })
        ),
        shareReplay()
    );

    readonly parentModule$: Observable<ParentModulePermission[]> = this.roleActions$.pipe(
        map(rs => {
            const parentModules = this.groupDataByKey(rs, 'm_GroupName');
            return parentModules.map(m => ({
                groupName: m.key,
                childs: this.groupDataByKey(m.value, 'm_KeyModule').map(item => ({
                    key: item.key,
                    icon: item.value[0].m_CssClass,
                    value: item.value[0].m_TenModule,
                    desc: item.value[0].m_MoTa,
                    group: item.value[0].m_GroupName,
                })),
            }));
        }),
        shareReplay()
    );

    readonly trigger$ = combineLatest([this.moduleSelected$, this.checkAll$, this.roleActionChanged$, this.functionGroupChaneged$]).pipe(
        shareReplay()
    );

    private forceUpdateChecked = false;
    private forceUpdateModule = false;
    private forceUpdateFunctionGroup = false;

    constructor(private rbacService: RbacService) {}

    setRoleId(idRole: string): void {
        this.idRole$.next(idRole);
    }

    setCheckAll(checked: boolean, module: ModulePermission): void {
        this.forceUpdateChecked = true;
        this.checkAll$.next(checked);
    }

    setModuleSelected(module: ModulePermission | null): void {
        this.forceUpdateModule = true;
        this.moduleSelected$.next(module);
    }

    setPermissionForFunction(): void {
        //
    }

    getRoleOption(idRole: string): Observable<RoleOptionSelected> {
        return this.rbacService.get(`${AclConstant.ACL_ROLE_ACTION}/ArrCkbRoleAction`, {
            idFunctionGroup: null,
            idRole,
        });
    }

    getDataByKey(): Observable<RoleAction[]> {
        return this.trigger$.pipe(
            switchMap(([modulePermission, checked, roleAction, functionGroupChanged]) => {
                if (!this.forceUpdateChecked) {
                    checked = null;
                }

                return this.permissions$.pipe(
                    map(roleActions => this.mapperRoleAction(roleActions, <string>modulePermission?.key, checked)),
                    map(roleActions => {
                        if (roleAction) {
                            roleActions.forEach(item => {
                                if (item.f_Id === roleAction.f_Id) {
                                    if (item.isView !== null) {
                                        item.isView = item.isHasRole;
                                    }

                                    if (item.isAdd !== null) {
                                        item.isAdd = item.isHasRole;
                                    }

                                    if (item.isEdit !== null) {
                                        item.isEdit = item.isHasRole;
                                    }

                                    if (item.isDelete !== null) {
                                        item.isDelete = item.isHasRole;
                                    }
                                    if (item.listOfOption && item.listOfOption.length > 0) {
                                        item.listOfOption.forEach(c => {
                                            if (c.isCheck !== null) {
                                                c.isCheck = item.isHasRole;
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        if (functionGroupChanged) {
                            const fG_Id = functionGroupChanged.items[0].fG_Id;
                            if (fG_Id) {
                                roleActions.forEach(item => {
                                    if (item.fG_Id === fG_Id) {
                                        item.isHasRole = functionGroupChanged.isChecked;
                                        if (item.isView !== null) {
                                            item.isView = functionGroupChanged.isChecked;
                                        }

                                        if (item.isAdd !== null) {
                                            item.isAdd = functionGroupChanged.isChecked;
                                        }

                                        if (item.isEdit !== null) {
                                            item.isEdit = functionGroupChanged.isChecked;
                                        }

                                        if (item.isDelete !== null) {
                                            item.isDelete = functionGroupChanged.isChecked;
                                        }
                                        if (item.listOfOption && item.listOfOption.length > 0) {
                                            item.listOfOption.forEach(c => {
                                                if (c.isCheck !== null) {
                                                    c.isCheck = functionGroupChanged.isChecked;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }

                        return roleActions;
                    })
                );
            }),
            tap(rs => {
                this.forceUpdateChecked = false;
                this.forceUpdateModule = false;

                // this.roleActionChanged$.next(null);
            }),
            shareReplay()
        );
    }

    savePermission(roleId: string): Observable<unknown> {
        return this.permissions$.pipe(
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
                    idSelected: roleId,
                    arrIdInherited: [],
                    arrAclView: permissions.filter(m => m.isView).map(m => m.f_Id),
                    arrAclAdd: permissions.filter(m => m.isAdd).map(m => m.f_Id),
                    arrAclEdit: permissions.filter(m => m.isEdit).map(m => m.f_Id),
                    arrAclDelete: permissions.filter(m => m.isDelete).map(m => m.f_Id),
                    arrAclOption: optional,
                };
            }),
            shareReplay()
        );
    }

    private mapperRoleAction(roleActions: RoleAction[], moduleKey: string, checked: boolean | null): RoleAction[] {
        return roleActions
            .filter(m => m.m_KeyModule === moduleKey)
            .map(item => {
                if (checked !== null) {
                    if (item.isView !== null) {
                        item.isView = checked;
                    }

                    if (item.isAdd !== null) {
                        item.isAdd = checked;
                    }

                    if (item.isEdit !== null) {
                        item.isEdit = checked;
                    }

                    if (item.isDelete !== null) {
                        item.isDelete = checked;
                    }
                    item.isHasRole = checked;
                    if (item.listOfOption && item.listOfOption.length > 0) {
                        item.listOfOption.forEach(c => {
                            if (c.isCheck !== null) {
                                c.isCheck = checked;
                            }
                        });
                    }
                }
                return item;
            });
    }

    private groupDataByKey(collection: any[], property = 'date'): any[] {
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
}
