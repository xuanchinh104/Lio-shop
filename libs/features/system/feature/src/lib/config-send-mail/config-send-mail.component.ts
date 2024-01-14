import { ChangeDetectionStrategy, Component, Injector, OnDestroy } from '@angular/core';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { Config, ConfigMail } from '@asc/features/system/data-access/models';
import { FormBuilder } from '@angular/forms';
import { ReziseTable } from '@asc/core/constants';
import { Observable, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-config-send-mail',
    templateUrl: './config-send-mail.component.html',
    styleUrls: ['./config-send-mail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigSendMailComponent extends BaseSystemListComponent<ConfigMail> implements OnDestroy {
    formSearch = this.formBuilder.group({
        mailKey: [null],
        mailAddress: [null],
    });
    pageHeight = window.innerHeight - ReziseTable;
    showSearch = false;

    isHienThi = false;

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

    removeHandler(dataItem?: ConfigMail): void {}

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
        return this.courseService.get<Config>('Config/List', {
            key: 'SEND_MAIL_AZURE',
        });
    }

    protected showFormCreateOrUpdate(): void {}
}
