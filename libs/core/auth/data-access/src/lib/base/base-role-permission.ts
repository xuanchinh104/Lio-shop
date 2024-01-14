import { Directive, Injector, OnInit } from '@angular/core';
import { MenuService } from '@asc/features/shell/data-access/state';
import { RoleActionEnum } from '../models';
import { Router } from '@angular/router';
import { AuthService } from '@asc/core/auth/services';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface IRoleAction {
    isView: boolean;
    isCreate: boolean;
    isUpdate: boolean;
    isDelete: boolean;
}

@Directive()
export abstract class BaseRolePermission implements OnInit {
    roles = {
        isView: false,
        isCreate: false,
        isUpdate: false,
        isDelete: false,
    };

    protected configRoute: Router;
    protected menuService: MenuService;
    protected auth: AuthService;
    protected modalService: NzModalService;
    constructor(injector: Injector) {
        this.menuService = injector.get(MenuService);
        this.configRoute = injector.get(Router);
        this.auth = injector.get(AuthService);
        this.modalService = injector.get(NzModalService);
    }

    ngOnInit(): void {
        this.initRoles();
    }

    initRoles(): void {
        const roles = this.menuService.hasPermissionCRUD(window.location.pathname);

        if (roles) {
            this.roles = {
                isCreate: roles.includes(RoleActionEnum.CREATE),
                isUpdate: roles.includes(RoleActionEnum.UPDATE),
                isDelete: roles.includes(RoleActionEnum.DELETE),
                isView: roles.includes(RoleActionEnum.READ),
            };
            if (!this.roles.isView) {
                this.configRoute.navigate(['/management/404']);
            }
        } else {
            this.modalService.closeAll();
            this.modalService.warning({
                nzTitle: 'Thông báo',
                nzContent: 'Phiên đăng nhập của bạn đã hết, vui lòng đăng nhập lại !',
                nzOkText: 'Đồng ý',
                nzMaskClosable: false,
                nzClosable: false,
                nzOnOk: () => {
                    this.auth.clearUserInfo$.next(true);
                    this.auth.doBackLogin();
                },
            });
        }
    }
}
