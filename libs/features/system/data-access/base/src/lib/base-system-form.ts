import { Directive, Injector, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '@asc/shared/services/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseFormComponent } from '@asc/shared/base';
import { TranslocoService } from '@ngneat/transloco';

@Directive()
export abstract class BaseSystemFormComponent<T> extends BaseFormComponent<T> implements OnDestroy {
    isCreateAndAddNew = false;
    isCheckSaveAndAdd = false;
    isLoadingSaveAndCreate = false;

    protected formBuilder: FormBuilder;
    protected notification: NotificationService;
    protected modalRef: NzModalRef;
    protected translocoService: TranslocoService;

    protected constructor(injector: Injector) {
        super();

        this.formBuilder = injector.get(FormBuilder);
        this.notification = injector.get(NotificationService);
        this.modalRef = injector.get(NzModalRef);
        this.translocoService = injector.get(TranslocoService);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    closeForm(result = false): void {
        if (this.isCheckSaveAndAdd) {
            result = true;
        }
        this.modalRef.close(result);
    }

    zoomForm(isZoom: boolean): void {
        if (isZoom) {
            this.modalRef.updateConfig({
                nzWrapClassName: 'modal-fullscreen',
            });
        } else {
            this.modalRef.updateConfig({
                nzWrapClassName: '',
            });
        }
    }
}
