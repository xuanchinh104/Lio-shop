import { Component, Injector, OnDestroy } from '@angular/core';
import { BaseWebManagerList, DanhMucTinTuc, WebManagerConstant } from '@asc/features/website-manager/data-access';
import { Column, COLUMN_KEY, DANH_MUC_COL } from '@asc/features/shell/data-access/state';
import { Observable, Subject } from 'rxjs';
import { CourseService } from '@asc/features/shell/data-access/service';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { map, takeUntil } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormDanhMucTinTucComponent } from '@asc/features/website-manager/ui';

@Component({
    selector: 'asc-danh-muc-tin-tuc',
    templateUrl: './danh-muc-tin-tuc.component.html',
    styleUrls: ['./danh-muc-tin-tuc.component.scss'],
})
export class DanhMucTinTucComponent extends BaseWebManagerList<DanhMucTinTuc> implements OnDestroy {
    columnDefault: Column[] = DANH_MUC_COL;
    columnKey = COLUMN_KEY.DANH_MUC;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private courseService: CourseService) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removeHandler(dataItem?: DanhMucTinTuc): void {
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
                    ? this.translocoService.translate('CF.DELETE_ROW_DATA', { value: dataItem.tenDanhMuc })
                    : this.translocoService.translate('CF.DELETE_DATA'),
                nzOkText: ModalDeleteConfig.yes,
                nzOkDanger: true,
                nzOnOk: () => {
                    this.courseService
                        .delete(WebManagerConstant.DANH_MUC_TIN_TUC, data)
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
            nzContent: FormDanhMucTinTucComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <DanhMucTinTuc>this.model,
                },
            },
            nzWidth: 800,
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
            .get<DanhMucTinTuc>(WebManagerConstant.DANH_MUC_TIN_TUC, {
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
