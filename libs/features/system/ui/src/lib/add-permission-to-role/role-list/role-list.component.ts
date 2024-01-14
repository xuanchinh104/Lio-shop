import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Output } from '@angular/core';
import { SafeEvent } from '@asc/shared/utils';
import { AclConstant } from '@asc/features/system/data-access/models';
import { map } from 'rxjs/operators';
import { RbacService } from '@asc/shared/services/common';
import { Observable } from 'rxjs';
import { ReziseTable } from '@asc/core/constants';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { GridDataResult } from '@progress/kendo-angular-grid';

type RoleUser = {
    id: string;
    role: string;
};

@Component({
    selector: 'asc-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent extends BaseSystemListComponent<RoleUser> {
    @Output() rolesSelected = new EventEmitter<string[]>();
    idsRoleSelected: string[] = [];
    pageHeight = window.innerHeight - ReziseTable;
    constructor(injector: Injector, private rbacService: RbacService) {
        super(injector);
    }

    selectedRows(e: SafeEvent): void {
        this.rolesSelected.emit(this.idsRoleSelected);
    }

    protected getData(): Observable<GridDataResult> {
        return this.rbacService.get(AclConstant.ACL_ROLE + '/ListRolesByCurrentLoggedInUser', this.queryOptions).pipe(
            map(res => ({
                data: res ? res.items : [],
                total: res ? res.pagingInfo?.totalItems : 0,
            }))
        );
    }

    protected showFormCreateOrUpdate(): void {
        // Code here
    }
}
