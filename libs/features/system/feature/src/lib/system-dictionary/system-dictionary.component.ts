import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy } from '@angular/core';
import { AclConstant, ELanguageResouce, EProjectType, EProjectTypeName, SystemDictionary } from '@asc/features/system/data-access/models';
import { RbacService } from '@asc/shared/services/common';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MessageConstant, ModalDeleteConfig } from '@asc/core/constants';
import { ReportUtil } from '@asc/shared/utils';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BaseSystemListComponent } from '@asc/features/system/data-access/base';
import { ImportSystemDictionaryFormComponent, SystemDictionaryFormComponent } from '@asc/features/system/ui';

@Component({
    selector: 'asc-nx-system-dictionary',
    templateUrl: './system-dictionary.component.html',
    styleUrls: ['./system-dictionary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemDictionaryComponent extends BaseSystemListComponent<SystemDictionary> implements OnDestroy {
    projectTypeE = EProjectType;
    projectType = EProjectType.DTNN;
    projectTypeName = EProjectTypeName;
    eLanguageResouce = ELanguageResouce;
    languageResouceUpdate = ELanguageResouce.VI;
    isMultiUpdate = false;
    isLoadingUpdate = false;
    isSyncSystem = false;

    private destroyed$ = new Subject();

    constructor(injector: Injector, private rbacService: RbacService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    muiltiUpdate(type: ELanguageResouce): void {
        this.isMultiUpdate = !this.isMultiUpdate;
        this.languageResouceUpdate = type;
    }

    submitMuiltiUpdate(): void {
        this.isLoadingUpdate = true;
        this.gridView$
            .pipe(
                switchMap((res: GridDataResult) => {
                    const listContent = res.data.map(x => ({
                        id: x.id,
                        value: this.languageResouceUpdate === ELanguageResouce.VI ? x.valueVI : x.valueEN,
                    }));
                    const dataSubmit = {
                        languageResouce: this.languageResouceUpdate,
                        controlLabels: listContent,
                    };
                    return this.rbacService.put(AclConstant.ACL_SYSLABEL + '/UpdateMultiple', dataSubmit);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.notification.showSuccessMessage(this.translocoService.translate('MSG_UPDATE_DONE'));
                this.isMultiUpdate = false;
                this.isLoadingUpdate = false;
                this.cdr.detectChanges();
            });
    }

    formInport(type: ELanguageResouce): void {
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: ImportSystemDictionaryFormComponent,
            nzComponentParams: {
                projectType: this.projectType,
                langType: type,
            },
            nzWidth: 500,
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
        });
        modal.afterClose.subscribe((isLoad: boolean) => {
            if (isLoad) {
                this.refresh$.next(isLoad);
            }
        });
    }

    download(type: ELanguageResouce): void {
        this.rbacService
            .download(AclConstant.ACL_SYSLABEL + '/Export', {
                projectType: this.projectType,
                languageResouce: type,
            })
            .pipe(
                tap(res => {
                    ReportUtil.downloadWithContenDiposition(res);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    syncResource(type: ELanguageResouce): void {
        this.rbacService
            .post(AclConstant.ACL_SYSLABEL + '/ReplaceLanguageConfig', {
                languageResouce: type,
                projectType: this.projectType,
            })
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_UPDATE_DONE);
            });
    }

    removeHandler(dataItem: SystemDictionary): void {
        const data = {
            ids: [dataItem.id],
        };
        this.modal.confirm({
            nzTitle: this.translocoService.translate('CF.TITLE'),
            nzContent: this.translocoService.translate('WR.XAC_NHAN_XOA'),
            nzOkText: this.translocoService.translate('LB.DELETE_DATA'),
            nzOkDanger: true,
            nzOnOk: () => {
                this.rbacService
                    .delete(AclConstant.ACL_SYSLABEL, data)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(() => {
                        this.notification.showSuccessMessage(this.translocoService.translate('MSG_DELETE_DONE'));
                        this.selectionIds = [];
                        this.refresh$.next(true);
                    });
            },
            nzCancelText: this.translocoService.translate('LB.NO'),
        });
    }

    onChangeModule(type: EProjectType): void {
        if (type > 0) {
            this.projectType = type;
            this.gridState.skip = 0;
            this.refresh$.next(true);
        }
    }

    protected showFormCreateOrUpdate(): void {
        const modal = this.modal.create({
            nzTitle: '',
            nzContent: SystemDictionaryFormComponent,
            nzComponentParams: {
                formState: {
                    data: <SystemDictionary>this.model,
                    action: this.action,
                },
                projectType: this.projectType,
            },
            nzWidth: 500,
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

    protected getData(): Observable<GridDataResult> {
        return this.rbacService
            .get(AclConstant.ACL_SYSLABEL, {
                ...this.queryOptions,
                projectType: this.projectType,
            })
            .pipe(
                map(res => ({
                    data: res ? res.items : [],
                    total: res ? res.pagingInfo?.totalItems : 0,
                }))
            );
    }
}
