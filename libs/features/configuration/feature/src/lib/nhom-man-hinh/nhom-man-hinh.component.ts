import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationService, RbacService } from '@asc/shared/services/common';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { map, takeUntil, tap } from 'rxjs/operators';
import { FormNhomManHinhComponent } from './form-nhom-man-hinh/form-nhom-man-hinh.component';
import { ModalDeleteConfig } from '@asc/core/constants';
import { BaseConfigurationListComponent, ConfigurationConstant, NhomManHinh } from '@asc/features/configuration/data-access';
import { SharedConfigurationService } from '@asc/features/configuration/service';
import { ListManHinhComponent } from '../list-man-hinh/list-man-hinh.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asc-nhom-man-hinh',
    templateUrl: './nhom-man-hinh.component.html',
    styleUrls: ['./nhom-man-hinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NhomManHinhComponent extends BaseConfigurationListComponent<NhomManHinh> {
    idModule!: number;

    readonly idModule$ = this.sharedConfigurationService.moduleId$.pipe(
        tap(idModule => {
            if (idModule) {
                this.idModule = idModule;

                this.refresh$.next(true);
            }
        })
    );

    private destroyed$ = new Subject();

    constructor(
        private rbacService: RbacService,
        private sharedConfigurationService: SharedConfigurationService,
        private notification: NotificationService,
        private translocoService: TranslocoService,
        injector: Injector
    ) {
        super(injector);
    }

    /**
     * Removes handler
     * @param dataItem
     */
    removeHandler(dataItem?: NhomManHinh): void {
        if (dataItem) {
            this.selectionIds = [];
            this.selectionIds.push(dataItem.id);
        }

        if (this.selectionIds.length > 0) {
            this.modal.confirm({
                nzTitle: this.translocoService.translate('CF.TITLE'),
                nzContent: this.translocoService.translate('WR.XAC_NHAN_XOA'),
                nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
                nzOkDanger: true,
                nzOnOk: () => {
                    this.rbacService
                        .delete(ConfigurationConstant.FUNCTION_GROUP, {
                            ids: this.selectionIds,
                        })
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.refresh$.next(true);
                            this.selectionIds = [];
                        });
                },
                nzCancelText: this.translocoService.translate('LB.NO'),
            });
        }
    }

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzContent: FormNhomManHinhComponent,
            nzComponentParams: {
                formState: {
                    action: this.action,
                    data: <NhomManHinh>this.model,
                },
                idModule: this.idModule,
            },
            nzWidth: 600,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose.subscribe(() => this.refresh$.next(true));
    }

    protected getData(keyword: string): Observable<GridDataResult> {
        return this.rbacService
            .get<NhomManHinh>(ConfigurationConstant.FUNCTION_GROUP_LIST, {
                ...this.queryOptions,
                keyword,
                isActive: true,
                sortName: 'order',
                idModule: this.idModule,
            })
            .pipe(
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                }))
            );
    }

    onSyncData(): void {
        // code here
        this.rbacService
            .put('Roles/AddOrUpdateModuleToRole', {}, true)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.notification.showSuccessMessage('Đồng bộ dữ liệu thành công');
            });
    }

    showListScreen(dataItem: NhomManHinh): void {
        const modal = this.modal.create({
            nzContent: ListManHinhComponent,
            nzComponentParams: {
                idGroup: dataItem.id,
            },
            nzWidth: 850,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose.subscribe(() => this.refresh$.next(true));
    }
}
