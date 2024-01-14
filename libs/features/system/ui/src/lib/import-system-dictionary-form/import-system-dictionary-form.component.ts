import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SafeAny } from '@asc/shared/utils';
import { RbacService } from '@asc/shared/services/common';
import { AclConstant, ELanguageResouce, EProjectType, EProjectTypeName } from '@asc/features/system/data-access/models';

@Component({
    selector: 'asc-nx-import-system-dictionary-form',
    templateUrl: './import-system-dictionary-form.component.html',
    styleUrls: ['./import-system-dictionary-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSystemDictionaryFormComponent implements OnDestroy {
    @Input() projectType: EProjectType = EProjectType.DTNN;
    @Input() langType: ELanguageResouce = ELanguageResouce.VI;
    @ViewChild('fileInput') fileInput?: ElementRef | null;
    fileAttach!: SafeAny;
    isSubmited = false;

    eProjectType = EProjectType;
    eProjectTypeName = EProjectTypeName;
    eLangRes = ELanguageResouce;

    private destroyed$ = new Subject();

    constructor(private modalRef: NzModalRef, private rbacService: RbacService) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    uploadFile($event: SafeAny): void {
        const file = $event.target.files;
        if (file && file.length > 0) {
            this.fileAttach = file[0];
        }
    }

    onSubmit(): void {
        const formData = new FormData();
        formData.append('fileDinhKem', this.fileAttach);
        formData.append('projectType', this.projectType.toString());
        formData.append('languageResouce', this.langType.toString());
        this.isSubmited = true;
        this.rbacService
            .post(AclConstant.ACL_SYSLABEL + '/Import', formData, true)
            .pipe(
                finalize(() => (this.isSubmited = false)),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.closeForm(true);
            });
    }

    closeForm(result = false): void {
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
