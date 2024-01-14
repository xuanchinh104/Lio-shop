import { Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '@asc/shared/services/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseFormComponent } from '@asc/shared/base';
import { DragDrop } from '@angular/cdk/drag-drop';
@Directive()
export abstract class BaseWebManagerForm<T> extends BaseFormComponent<T> implements OnDestroy {
    isSubmited = false;
    isCreateAndAddNew = false;
    isCheckSaveAndAdd = false;
    isLoadingSaveAndCreate = false;

    protected formBuilder: FormBuilder;
    protected notification: NotificationService;
    protected modalRef: NzModalRef;
    protected dragDrop: DragDrop;

    protected constructor(injector: Injector) {
        super();

        this.formBuilder = injector.get(FormBuilder);
        this.notification = injector.get(NotificationService);
        this.modalRef = injector.get(NzModalRef);
        this.dragDrop = injector.get(DragDrop);
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
