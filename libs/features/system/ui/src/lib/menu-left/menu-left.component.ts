import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuSelector, MenuService } from '@asc/features/shell/data-access/state';
import { map, tap } from 'rxjs/operators';
import { SafeAny } from '@asc/shared/utils';

@Component({
    selector       : 'asc-menu-left',
    templateUrl    : './menu-left.component.html',
    styleUrls      : ['./menu-left.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLeftComponent {
    menuLefts = [
        // {
        //     title: 'Người dùng',
        //     link: '/system/user',
        //     cssBadge: 'ONLY',
        //     css: '',
        //     icon: 'zmdi-accounts-alt',
        // },
        {
            title: 'Vai trò quyền hạn',
            link: '/system/vai-tro-quyen-han',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi-assignment-check',
        },
        {
            title: 'Phân quyền người dùng',
            link: '/system/phan-quyen-nguoi-dung',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi-account-add',
        },
        {
            title: 'Phân hệ',
            link: '/system/phan-he',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi-view-module',
        },
        {
            title: 'Đồng bộ nhân sự',
            link: '/system/dong-bo-nhan-su',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi zmdi-refresh-alt',
        },
        {
            title: 'Cấu hình website',
            link: '/system/cau-hinh',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi zmdi-settings',
        },
        // {
        //     title: 'Lịch sử đăng nhập',
        //     link: '/system/lich-su-dang-nhap',
        //     cssBadge: 'ONLY',
        //     css: '',
        //     icon: 'zmdi-devices',
        // },
        {
            title: 'Hệ thống mail',
            link: '/system/cau-hinh-email',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi zmdi-email',
        },
        {
            title: 'Nội dung mail',
            link: '/system/cau-hinh-noi-dung-email',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi zmdi-file',
        },
        {
            title: 'Cấu hình từ điển',
            link: '/system/tu-dien-he-thong',
            cssBadge: 'ONLY',
            css: '',
            icon: 'zmdi zmdi-settings',
        },
    ];
    readonly menus$ = this.menuSelector.menuTop$.pipe(
        map(s => s.length > 0 ? s[0].manHinhs : []),
        map(s => s.filter(m => !['ACL_HT_ROLE_GROUPMODULE', 'ACL_HT_ROLE_UWSYS'].includes(m.f_ShortName)))
    );

    constructor(private router: Router,
                private menuService: MenuService,
                private menuSelector: MenuSelector) {
    }

    goDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    trackByFunc(index: number, elem: SafeAny): string {
        return elem.f_Id;
    }
}
