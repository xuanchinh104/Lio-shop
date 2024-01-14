import { Component, Injector, OnDestroy } from '@angular/core';
import { BaiViet, BaseWebManagerList, WebManagerConstant } from '@asc/features/website-manager/data-access';
import { BAI_VIET_COL, Column, COLUMN_KEY } from '@asc/features/shell/data-access/state';
import { Observable, Subject } from 'rxjs';
import { CourseService } from '@asc/features/shell/data-access/service';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { map, takeUntil } from 'rxjs/operators';
import { FormBaiVietComponent } from '@asc/features/website-manager/ui';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
    selector: 'asc-bai-viet',
    templateUrl: './bai-viet.component.html',
    styleUrls: ['./bai-viet.component.scss'],
})
export class BaiVietComponent extends BaseWebManagerList<BaiViet> implements OnDestroy {
    columnDefault: Column[] = BAI_VIET_COL;
    columnKey = COLUMN_KEY.BAI_VIET;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private courseService: CourseService) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    removeHandler(dataItem?: BaiViet): void {
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
                        .delete(WebManagerConstant.BAI_VIET, data)
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
            nzContent: FormBaiVietComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <BaiViet>this.model,
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
            .get<BaiViet>(WebManagerConstant.BAI_VIET, {
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
