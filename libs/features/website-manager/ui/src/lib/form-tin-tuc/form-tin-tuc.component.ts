import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, Input, OnDestroy } from '@angular/core';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { Validators } from '@angular/forms';
import { CourseService } from '@asc/features/shell/data-access/service';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';
import { BaseWebManagerForm, TinTuc, WebManagerConstant } from '@asc/features/website-manager/data-access';
import * as DecoupledEditorBuild from '@ckeditor/ckeditor5-build-decoupled-document';
import { CkeditorUploadAdapter } from '@asc/shared/ckeditor-config';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { JwtService } from '@asc/core/auth/services';

@Component({
    selector: 'asc-form-tin-tuc',
    templateUrl: './form-tin-tuc.component.html',
    styleUrls: ['./form-tin-tuc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTinTucComponent extends BaseWebManagerForm<TinTuc> implements OnDestroy {
    _formState!: FormState<TinTuc>;

    @Input() set formState(state: FormState<TinTuc>) {
        this._formState = state;
        if (state.action === ActionEnum.UPDATE && state.data) {
            this.avatarUrl = state.data.hinhDaiDien;
            this.form.patchValue(state.data);
        }
        this.isCreateAndAddNew = [ActionEnum.CREATE, ActionEnum.DUPLICATE].includes(this._formState.action);
    }

    form = this.formBuilder.group({
        id: [null],
        tieuDe: ['', Validators.required],
        idPhongBan: [null, Validators.required],
        noiDung: ['', Validators.required],
        moTa: [''],
        isHienThi: [true],
        hinhDaiDien: [''],
    });

    phongBans$ = this.courseService.getPhongBans();

    isSubmited = false;
    actionEnum = ActionEnum;

    Editor: any = DecoupledEditorBuild;
    editorControl: any;
    configCkeditor = {
        fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21],
        },
        toolbar: {
            items: [
                'sourceEditing',
                'heading',
                '|',
                'alignment',
                '|',
                'bold',
                'italic',
                'underline',
                'subscript',
                'superscript',
                '|',
                'link',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
                '|', // break point
                'fontfamily',
                'fontsize',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'code',
                'codeBlock',
                '|',
                'outdent',
                'indent',
                '|',
                'uploadImage',
                'blockQuote',
                '|',
                'undo',
                'redo',
            ],
            shouldNotGroupWhenFull: true,
        },
    };

    avatarUrl = '';

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private jwtService: JwtService,
        injector: Injector,
        private courseService: CourseService,
        private cdr: ChangeDetectorRef
    ) {
        super(injector);
    }

    get titleKey(): string {
        return this._formState.action === ActionEnum.CREATE ? 'WEB.ADD_TIN_TUC' : 'WEB.UPDATE_TIN_TUC';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    onReady(editor: any): void {
        this.editorControl = editor;
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) =>
            new CkeditorUploadAdapter(loader, this.env, this.jwtService);
        editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
        // editor.model.schema.extend('image', {
        //     allowAttributes: 'imageWidth'
        //   });
        // editor.model.document.on('change', () => {
        //     console.log('Editor content:', editor.getData());
        // });
    }

    getUrlAvatarChange(url: string): void {
        if (url) {
            this.avatarUrl = url;
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isSubmited = true;
            const data = {
                ...this.form.value,
                hinhDaiDien: this.avatarUrl,
            };
            switch (this._formState.action) {
                case ActionEnum.CREATE:
                    this.courseService
                        .post(WebManagerConstant.CHI_TIET_TIN_TUC, data, true)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                                this.cdr.detectChanges();
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                            this.closeForm(true);
                        });
                    break;
                case ActionEnum.UPDATE:
                    this.courseService
                        .put(WebManagerConstant.CHI_TIET_TIN_TUC, data, true)
                        .pipe(
                            finalize(() => {
                                this.isSubmited = false;
                                this.cdr.detectChanges();
                            }),
                            takeUntil(this.destroyed$)
                        )
                        .subscribe(() => {
                            this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_UPDATE_DONE);
                            this.closeForm(true);
                        });
                    break;
            }
        }
    }

    onSaveAndAddNew(): void {
        if (this.form.invalid) {
            validateAllFormFields(this.form);
        } else {
            this.isCheckSaveAndAdd = true;
            this.isLoadingSaveAndCreate = true;
            const data = {
                ...this.form.value,
                hinhDaiDien: this.avatarUrl,
            };
            this.courseService
                .post(WebManagerConstant.CHI_TIET_TIN_TUC, data, true)
                .pipe(
                    finalize(() => {
                        this.isLoadingSaveAndCreate = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe(() => {
                    this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
                    this.form.reset();
                    this.form.get('isNew')?.setValue(true);
                    this.form.get('isNoiBat')?.setValue(true);
                    this.form.get('isHienThi')?.setValue(true);
                    this.avatarUrl = '';
                    this.cdr.detectChanges();
                });
        }
    }
}
