import { Component, Injector, OnDestroy } from '@angular/core';
import { Column, COLUMN_KEY, TIN_TUC_COL } from '@asc/features/shell/data-access/state';
import { Observable, Subject } from 'rxjs';
import { CourseService } from '@asc/features/shell/data-access/service';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { map, takeUntil } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BaseWebManagerList, TinTuc, WebManagerConstant } from '@asc/features/website-manager/data-access';
import { FormTinTucComponent } from '@asc/features/website-manager/ui';

@Component({
    selector: 'asc-tin-tuc',
    templateUrl: './tin-tuc.component.html',
    styleUrls: ['./tin-tuc.component.scss'],
})
export class TinTucComponent extends BaseWebManagerList<TinTuc> implements OnDestroy {
    columnDefault: Column[] = TIN_TUC_COL;
    columnKey = COLUMN_KEY.TIN_TUC;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private courseService: CourseService) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removeHandler(dataItem?: TinTuc): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            const data = {
                ids: this.selectionIds,
            };
            this.modal.confirm({
                nzTitle: ModalDeleteConfig.title,
                nzContent: dataItem
                    ? this.translocoService.translate('CF.DELETE_ROW_DATA', { value: dataItem.tieuDe })
                    : this.translocoService.translate('CF.DELETE_DATA'),
                nzOkText: ModalDeleteConfig.yes,
                nzOkDanger: true,
                nzOnOk: () => {
                    this.courseService
                        .delete(WebManagerConstant.CHI_TIET_TIN_TUC, data)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_DELETE_DONE);
                            this.refresh$.next(true);
                            this.selectionIds = [];
                        });
                },
                nzCancelText: ModalDeleteConfig.no,
            });
        }
    }

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzContent: FormTinTucComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <TinTuc>this.model,
                },
            },
            nzWidth: 1200,
            nzFooter: null,
            nzClosable: false,
            nzMaskClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(isLoad);
            }
        });
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.courseService
            .get<TinTuc>(WebManagerConstant.CHI_TIET_TIN_TUC, {
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
}
