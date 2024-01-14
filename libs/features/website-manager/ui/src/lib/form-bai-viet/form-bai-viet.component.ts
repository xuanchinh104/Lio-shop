import { ChangeDetectorRef, Component, Inject, Injector, Input, OnDestroy } from '@angular/core';
import { BaiViet, BaseWebManagerForm, WebManagerConstant } from '@asc/features/website-manager/data-access';
import { ActionEnum, FormState } from '@asc/shared/data-access';
import { Validators } from '@angular/forms';
import * as DecoupledEditorBuild from '@ckeditor/ckeditor5-build-decoupled-document';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { JwtService } from '@asc/core/auth/services';
import { CourseService } from '@asc/features/shell/data-access/service';
import { CkeditorUploadAdapter } from '@asc/shared/ckeditor-config';
import { validateAllFormFields } from '@asc/shared/utils';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageConstant } from '@asc/core/constants';

@Component({
    selector: 'asc-form-bai-viet',
    templateUrl: './form-bai-viet.component.html',
    styleUrls: ['./form-bai-viet.component.scss'],
})
export class FormBaiVietComponent extends BaseWebManagerForm<BaiViet> implements OnDestroy {
    _formState!: FormState<BaiViet>;

    @Input() set formState(state: FormState<BaiViet>) {
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
        noiDung: ['', Validators.required],
        moTa: [''],
        hinhDaiDien: [''],
        isHienThi: [true],
        idPhongBan: [null, Validators.required],
    });

    phongBan$ = this.courseService.getPhongBans();

    isSubmited = false;
    actionEnum = ActionEnum;

    avatarUrl = '';

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
        return this._formState.action === ActionEnum.CREATE ? 'WEB.ADD_BAI_VIET' : 'WEB.UPDATE_BAI_VIET';
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
                        .post(WebManagerConstant.BAI_VIET, data, true)
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
                        .put(WebManagerConstant.BAI_VIET, data, true)
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
                .post(WebManagerConstant.BAI_VIET, data, true)
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
                    this.form.get('isHienThi')?.setValue(true);
                    this.cdr.detectChanges();
                });
        }
    }
}
