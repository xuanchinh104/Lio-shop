import { ChangeDetectionStrategy, Component, Injector, OnDestroy } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { ConfigMailContent } from '@asc/features/system/data-access/models';
import { FormBuilder } from '@angular/forms';
import { ReziseTable } from '@asc/core/constants';
import { Observable, of, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-config-content-mail',
    templateUrl: './config-content-mail.component.html',
    styleUrls: ['./config-content-mail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigContentMailComponent extends BaseSystemListComponent<ConfigMailContent> implements OnDestroy {
    formSearch = this.formBuilder.group({
        keyContent: [null],
    });
    pageHeight = window.innerHeight - ReziseTable;
    showSearch = false;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private formBuilder: FormBuilder, private courseService: CourseService) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onDeselectedAll(): void {
        this.selectionIds.length = 0;
    }

    refreshHandler(): void {
        this.formSearch.reset();
    }

    removeHandler(dataItem?: ConfigMailContent): void {}

    closeSearch(): void {
        this.showSearch = false;
    }

    onSearchChange(): void {
        this.showSearch = false;
        this.gridState.skip = 0;
        this.selectionIds = [];
        this.gridChange$.next(this.gridState);
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return of();
    }

    protected showFormCreateOrUpdate(): void {}
}
