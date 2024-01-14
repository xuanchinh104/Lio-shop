import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { MenuService } from '@asc/features/shell/data-access/state';

enum ActionTypeEnum {
    XEM = 1,
    THEM = 2,
    SUA = 3,
    XOA = 4,
    TUY_CHON = 5,
}
@Directive({
    selector: '[HideIfUnauthorized]',
})
export class MyHideIfUnauthorizedDirective implements OnInit {
    @Input('HideIfUnauthorized') keyOption?: string | string[];

    readonly crudOperations = ['Create', 'Update', 'Delete'];
    readonly mapperKeyEnum: { [key: string]: number } = {
        Create: ActionTypeEnum.THEM,
        Update: ActionTypeEnum.SUA,
        Delete: ActionTypeEnum.XOA,
    };
    constructor(private el: ElementRef, private service: MenuService) {}

    ngOnInit(): void {
        if (Array.isArray(this.keyOption)) {
            const crud = this.keyOption.filter(m => this.crudOperations.includes(m));

            if (crud.length > 0) {
                // handle case crud basic
                const keyRoleMapper = crud.map(key => this.mapperKeyEnum[<string>key]) as number[];

                const roles = this.service.hasPermissionCRUD(window.location.pathname);
                if (keyRoleMapper.filter(m => roles.includes(m)).length < 1) {
                    this.el.nativeElement.remove();
                }
            } else {
                // key option => code here
            }
        } else {
            if (this.crudOperations.includes(<string>this.keyOption)) {
                const roles = this.service.hasPermissionCRUD(window.location.pathname);
                if (!roles.includes(this.mapperKeyEnum[<string>this.keyOption])) {
                    this.el.nativeElement.remove();
                }
            } else {
                if (!this.service.hasKeyPermission(<string>this.keyOption)) {
                    this.el.nativeElement.style.display = 'none';
                    this.el.nativeElement.remove();
                }
            }
        }
    }
}
