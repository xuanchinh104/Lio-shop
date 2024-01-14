import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Output } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { ReziseTable } from '@asc/core/constants';
import { SafeEvent } from '@asc/shared/utils';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators';
import { CatalogConstant, PhongBan } from '@asc/features/catalog/data-access';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-role-department-list',
    templateUrl: './role-department-list.component.html',
    styleUrls: ['./role-department-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDepartmentListComponent extends BaseSystemListComponent<PhongBan> {
    @Output() rolesSelected = new EventEmitter<number[]>();
    idsRoleSelected: number[] = [];
    pageHeight = window.innerHeight - ReziseTable;

    constructor(injector: Injector, private courseService: CourseService) {
        super(injector);
    }

    selectedRows(e: SafeEvent): void {
        this.rolesSelected.emit(this.idsRoleSelected);
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.courseService
            .get(CatalogConstant.PHONG_BAN, {
                ...this.queryOptions,
                keyword,
            })
            .pipe(
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
