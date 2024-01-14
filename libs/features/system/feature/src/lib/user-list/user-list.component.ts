import { ChangeDetectionStrategy, Component, Injector, OnDestroy } from '@angular/core';
import { UserChangePasswordComponent, UserFormComponent } from '@asc/features/system/ui';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MessageConstant, ModalDeleteConfig, ReziseTable } from '@asc/core/constants';
import { Observable, of, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AclConstant, UserOfList, UserTypeDescription, UserTypeEnum, UserTypeList } from '@asc/features/system/data-access/models';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { RbacService } from '@asc/shared/services/common';
import { FormBuilder } from '@angular/forms';
import { CourseService } from '@asc/features/shell/data-access/service';
import { PhongBan } from '@asc/features/catalog/data-access';
import { ModuleTypeEnum } from '@asc/shared/data-access';

@Component({
    selector: 'asc-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent extends BaseSystemListComponent<UserOfList> implements OnDestroy {
    formSearch = this.formBuilder.group({
        idCoSo: [null],
        idChucVu: [null],
        idPhongBan: [null],
        firstName: [null],
        lastName: [null],
        email: [null],
        phoneNumber: [null],
    });

    phongBans: PhongBan[] = [];

    phongBans$ = this.courseService.getPhongBans().pipe(tap(res => (this.phongBans = res)));

    userTypeDescription = UserTypeDescription;
    userTypeList = UserTypeList;

    userType = UserTypeEnum.NHAN_SU;

    private destroyed$ = new Subject();

    constructor(
        injector: Injector,
        private rbacService: RbacService,
        private formBuilder: FormBuilder,
        private courseService: CourseService
    ) {
        super(injector);
        this.pageHeight = window.innerHeight - ReziseTable;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onChangePassword(dataItem?: UserOfList): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            const modal = this.modal.create({
                nzTitle: '',
                nzContent: UserChangePasswordComponent,
                nzComponentParams: {
                    idUsers: this.selectionIds,
                },
                nzWidth: 600,
                nzFooter: null,
                nzMaskClosable: false,
                nzCloseIcon: '',
            });
            // Return a result when closed
            modal.afterClose.subscribe();
        }
    }

    addUser(): void {
        const modal = this.modal.create({
            nzTitle: 'Người dùng',
            // nzContent        : UserFormFullComponent,
            nzComponentParams: {
                action: this.action,
                model: <UserOfList>this.model,
            },
            nzWidth: 700,
            nzFooter: null,
            nzMaskClosable: false,
        });
        // Return a result when closed
        modal.afterClose
            .pipe(
                switchMap(isLoad => {
                    if (isLoad) {
                        // return this.getListData();
                    }
                    return of([]);
                })
            )
            .subscribe();
    }

    /**
     * Removes handler
     * @param dataItem
     */
    removeHandler(dataItem?: UserOfList): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            const data = {
                ids: this.selectionIds,
            };
            this.modal.confirm({
                nzTitle: `Xóa người dùng`,
                nzContent: dataItem
                    ? `
                    Bạn có thực sự muốn xóa người dùng <b>${dataItem.userName}</b> không?
                `
                    : `Bạn có chắc chắn muốn xóa những người dùng này không?`,
                nzOkText: ModalDeleteConfig.yes,
                nzOkDanger: true,
                nzOnOk: () => {
                    this.rbacService
                        .delete(AclConstant.ACL_USER, data)
                        .pipe(
                            tap(() => {
                                // check item cuối của trang mới
                                // if (this.gridView.data.length === this.selectionIds.length && this.queryOptions.pageNumber > 1) {
                                //     if (this.gridState.skip && this.gridState.skip > 0) {
                                //         this.gridState.skip = (this.queryOptions.pageNumber - 2) * (this.gridState.take ?? 20);
                                //     } else {
                                //         this.gridState.skip = 0;
                                //     }
                                // }
                            }), // switchMap(() => this.getListData()),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_DELETE_DONE);
                            this.selectionIds = [];
                        });
                },
                nzCancelText: ModalDeleteConfig.no,
            });
        }
    }

    refreshHandler(): void {
        this.formSearch.reset();
    }

    onChangeUserType(userType: number): void {
        this.refresh$.next(true);
    }

    protected getData(): Observable<GridDataResult> {
        return this.phongBans$.pipe(
            switchMap(() =>
                this.rbacService
                    .get(AclConstant.ACL_USER + '/ListOfUser', {
                        ...this.queryOptions,
                        ...this.formSearch.value,
                        userType: this.userType,
                        moduleType: ModuleTypeEnum.DAO_TAO_NGAN_HAN,
                    })
                    .pipe(
                        map(res => ({
                            data: res ? res.items : [],
                            total: res ? res.pagingInfo?.totalItems : 0,
                        })),
                        tap(res => {
                            res.data.forEach((item1: UserOfList) => {
                                const matchingItem2 = this.phongBans.find(item2 => item1.idPhongBan === item2.id);

                                if (matchingItem2) {
                                    item1.tenPhongBan = matchingItem2.tenPhongBan;
                                }
                            });
                        })
                    )
            )
        );
    }

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: UserFormComponent,
            nzComponentParams: {
                action: this.action,
                model: <UserOfList>this.model,
            },
            nzWidth: 700,
            nzFooter: null,
            nzMaskClosable: false,
            nzCloseIcon: '',
            nzClosable: false,
        });
        // Return a result when closed
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(isLoad);
            }
        });
    }
}
