import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '@asc/core/auth/services';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenInfo } from '@asc/core/auth/data-access';
import { TranslocoService } from '@ngneat/transloco';
import { DbService } from '@asc/shared/services/index-db';
import { DOCUMENT } from '@angular/common';
import { MenuService } from '@asc/features/shell/data-access/state';
import { SafeEvent } from '@asc/shared/utils';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'asc-dropdown-profile',
    templateUrl: './dropdown-profile.component.html',
    styleUrls: ['./dropdown-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownProfileComponent {
    readonly userInfo$: Observable<TokenInfo | null> = this.authService.getUserInfo().pipe(
        map(userInfo => {
            if (!userInfo?.firstname && !userInfo?.lastname) {
                const fetchUserInfo = this.authService.userinfoSSO;
                if (fetchUserInfo) {
                    return {
                        ...userInfo,
                        firstname: fetchUserInfo.first_name,
                        lastname: fetchUserInfo.last_name,
                    } as TokenInfo;
                }
            }

            return userInfo;
        })
    );

    resJsonResponse: any;
    downloadJsonHref: any;

    constructor(
        private modal: NzModalService,
        private translocoService: TranslocoService,
        private authService: AuthService,
        private dbService: DbService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private readonly document: Document
    ) {}

    onShowModalChangePass(): void {
        this.modal.create({
            nzTitle: this.translocoService.translate('LB.CHANGE_PASS'),
            nzContent: ChangePasswordComponent,
            nzWidth: 400,
            nzFooter: null,
            nzMaskClosable: false,
        });
    }

    onLogout(): void {
        this.authService.onLogoutByRedirect();
    }

    clearCache(): void {
        this.menuService.clearState();

        this.dbService
            .clearColumnData()
            .pipe(switchMap(() => this.menuService.fetchMenu()))
            .subscribe(() => {
                this.document.location.reload();
            });
    }

    onImport(event: SafeEvent): void {
        const file = event.srcElement.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = (evt: any) => {
                console.warn(JSON.parse(evt.target.result));

                this.resJsonResponse = JSON.parse(evt.target.result);
            };
            reader.onerror = (evt: any) => {
                console.warn('error reading file');
            };
        }
    }

    onDownload(): void {
        const sJson = JSON.stringify(this.resJsonResponse);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
        element.setAttribute('download', 'primer-server-task.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }
}
