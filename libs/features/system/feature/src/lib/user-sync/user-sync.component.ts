import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { AclConstant, RoleOfList, User } from '@asc/features/system/data-access/models';
import { FormBuilder } from '@angular/forms';
import { SafeAny } from '@asc/shared/utils';
import { ReziseTable } from '@asc/core/constants';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RbacService } from '@asc/shared/services/common';
import { CreateDefaultPasswordComponent } from '@asc/features/system/ui';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-user-sync',
    templateUrl: './user-sync.component.html',
    styleUrls: ['./user-sync.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSyncComponent extends BaseSystemListComponent<RoleOfList> {
    phongBans$ = this.courseService.getPhongBans();
    formSearch = this.formBuilder.group({
        idCoSo: [null],
        idChucVu: [null],
        idPhongBan: [null],
        email: [null],
        phoneNumber: [null],
    });
    listUser: User[] = [];
    pageHeight = window.innerHeight - ReziseTable;

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
        private rbacService: RbacService,
        private courseService: CourseService
    ) {
        super(injector);
    }

    onDeselectedAll(): void {
        this.selectionIds.length = 0;
    }

    refreshHandler(): void {
        this.formSearch.reset();
    }

    onSyncNhanSu(): void {
        const userSelected = this.getUserSelected();
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: CreateDefaultPasswordComponent,
            nzComponentParams: { userSelected },
            nzWidth: 400,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        // Return a result when closed
        modal.afterClose.subscribe((result: SafeAny) => {
            if (result) {
                this.onDeselectedAll();
            }
        });
    }

    protected getData(): Observable<GridDataResult> {
        return this.courseService
            .get(AclConstant.NHAN_SU, {
                ...this.queryOptions,
                ...this.formSearch.value,
            })
            .pipe(
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                })),
                tap(res => (this.listUser = res.data))
            );
    }

    protected showFormCreateOrUpdate(): void {
        // Code here
    }

    private getUserSelected(): User[] {
        return this.listUser.filter(m => this.selectionIds.includes(m.id));
    }
}
