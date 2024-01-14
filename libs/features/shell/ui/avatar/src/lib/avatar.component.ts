import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SafeEvent } from '@asc/shared/utils';
import { FileRequest, FileService, NotificationService } from '@asc/shared/services/common';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { finalize, takeUntil } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewAvatarComponent } from './view-avatar/view-avatar.component';

export interface AvatarPhoto {
    avatarUrl?: string | '';
    avatarUrlProxy?: string | '';
    size: number;
    firstName?: string | '';
    lastName?: string | '';
    isEdit?: boolean;
    isView?: boolean;
    borderNone?: boolean;
    hoTen?: string;
}

export interface ParamAvatar {
    textSize: number;
}

@Component({
    selector: 'asc-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnDestroy {
    @ViewChild('avatar', { static: true }) image!: ElementRef;
    @ViewChild('fileInput') fileInput?: ElementRef | null;
    avatarUrl$ = new BehaviorSubject<string>('');
    isLoading$ = new BehaviorSubject<boolean>(false);
    visible = false;

    avatarChange!: string;

    @Input() set isRefresh(refresh: boolean) {
        if (refresh) {
            this.avatarUrl$.next('');
        }
    }

    dataAvatar!: AvatarPhoto;

    @Input() set data(value: AvatarPhoto) {
        this.avatarChange = '';
        this.dataAvatar = Object.assign({}, value);
        if (this.dataAvatar.avatarUrl) {
            this.avatarUrl$.next(this.dataAvatar.avatarUrl);
        } else {
            this.avatarUrl$.next('');
        }
    }

    paramAvatar!: ParamAvatar;

    @Input() set param(value: ParamAvatar) {
        if (value) {
            this.paramAvatar = Object.assign({}, value);
        }
    }

    @Output() avatarUrlChange = new EventEmitter<string>();

    public avatarColors: any = {
        A: '#7f1b9f',
        Ă: '#3470c5',
        Â: '#c76529',
        B: '#7f1b9f',
        C: '#2b8d64',
        D: '#b68d01',
        Đ: '#e542dd',
        E: '#7f1b9f',
        Ê: '#55c230',
        F: '#7f1b9f',
        G: '#b68d01',
        H: '#e26d0f',
        I: '#7f1b9f',
        J: '#b94cdc',
        K: '#2b8d64',
        L: '#6c727a',
        M: '#e26d0f',
        N: '#e85528',
        O: '#1d529e',
        Ô: '#1d529e',
        Ơ: '#e17a26',
        P: '#7f1b9f',
        Q: '#1d529e',
        R: '#e26d0f',
        S: '#e78d43',
        T: '#1d529e',
        U: '#10529e',
        Ư: '#1bd278',
        V: '#ec0d2a',
        X: '#7f1b9f',
        Y: '#7f1b9f',
        Z: '#7f1b9f',
        W: '#7f1b9f',
        '1': '#e26d0f',
        '2': '#e26d0f',
        '3': '#1d529e',
        '4': '#10529e',
        '5': '#ec0d2a',
        '6': '#7f1b9f',
        '7': '#e26d0f',
        '8': '#7f1b9f',
        '9': '#e26d0f',
    };

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService,
        private upLoadAvatarService: FileService,
        private modal: NzModalService
    ) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    setDefaultAvatar(event: SafeEvent): void {
        event.target.src = window.location.origin + '/assets/images/no-avatar.jpg';
    }

    get initials(): string {
        const firstName = this.dataAvatar.firstName;
        const latsName = this.dataAvatar.lastName;
        const fullName = this.dataAvatar.hoTen;
        if (firstName && latsName) {
            return `${firstName[0].toUpperCase()}` + `${latsName[0].toUpperCase()}`;
        }

        if (fullName) {
            return `${fullName[0][0].toUpperCase()}` + `${fullName[fullName.length - 1][0].toUpperCase()}`;
        }
        return '';
    }

    get circleColor(): string {
        if (!this.initials) {
            return '';
        }

        return this.avatarColors[this.initials[this.initials.length - 1]];
    }

    uploadFile(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fileList = target.files as FileList;
        this.loadFile(fileList);
    }

    viewAvatar(): void {
        this.modal.create({
            nzContent: ViewAvatarComponent,
            nzWrapClassName: 'nz-fullbox view-file',
            nzClosable: false,
            nzComponentParams: {
                avatar: this.avatarChange ? this.avatarChange : this.dataAvatar.avatarUrl,
            },
            nzFooter: null,
            nzMaskClosable: false,
        });
    }

    private loadFile(fileList: FileList): void {
        const imageExt = ['jpg', 'jpeg', 'png', 'JPG', 'PNG', 'JPEG'];
        const isLt20MB = fileList[0]?.size / 1024 / 1024 < 20;
        const fileItem = fileList[0].name.split('.');
        const isImage = imageExt.includes(fileItem[fileItem.length - 1]);
        if (isImage) {
            if (isLt20MB) {
                this.isLoading$.next(true);
                this.upLoadAvatarService
                    .uploadFile(fileList)
                    .pipe(
                        finalize(() => this.isLoading$.next(false)),
                        takeUntil(this.destroyed$)
                    )
                    .subscribe(
                        (res: FileRequest) => {
                            const avtUrl = `${this.env.mediaServer}/${res.url}`;
                            this.clearValueInput();
                            this.avatarUrl$.next(avtUrl);
                            this.avatarUrlChange.emit(res.url);
                            this.avatarChange = res.url;
                        },
                        () => {
                            this.notification.showWarningMessage('Có lỗi xảy ra vui lòng thử lại !');
                            this.clearValueInput();
                        }
                    );
            } else {
                this.notification.showWarningMessage('Ảnh phải nhỏ hơn 20MB !');
                this.clearValueInput();
            }
        } else {
            this.notification.showWarningMessage('Chỉ chấp nhận file hình ảnh !');
        }
    }

    private clearValueInput(): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = null;
        }
    }
}
