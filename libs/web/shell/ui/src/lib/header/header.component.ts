import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AuthService, REDIRECT_URL_CALLBACK, REDIRECT_URL_SSO } from '@asc/core/auth/services';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { SecurityUtil } from '@asc/shared/utils';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CartService, CourseWebService, SettingService } from '@asc/web/shell/data-access/service';
import { FormControl } from '@angular/forms';
import { CourseWebConfig, KeyConfigWeb } from '@asc/web/shell/data-access/constant';
import { combineLatest, Observable, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { StorageService } from '@asc/shared/services/storage';
import { NzModalService } from 'ng-zorro-antd/modal';
import { log } from 'ng-zorro-antd/core/logger';

interface Menu {
    alias: string;
    title: string;
    isActive: boolean;
    isExpand?: boolean;
    subMenu: SubMenu[];
}

interface SubMenu {
    title: string;
    url: string;
}

@Component({
    selector: 'asc-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @ViewChild('inputSearch') inputSearch!: ElementRef;
    @ViewChild('inputElement') inputElement!: ElementRef;

    readonly triggerSync$ = combineLatest([this.auth.getUserInfo(), this.auth.refreshAvatar$]).pipe(map(([userInfo]) => userInfo));
    readonly userInfo$ = this.triggerSync$.pipe(
        switchMap(rs => {
            if (rs && (!rs?.firstname || !rs?.lastname)) {
                return this.courseService.getStudentInfo().pipe(
                    tap(studentInfo => {
                        this.storageService.store(CourseWebConfig.HOC_VIEN_INFO, studentInfo);
                        if (!studentInfo) {
                            // console.warn(studentInfo)
                            // window.location.assign(this.env.authServer);
                            this.auth.redirectWhenWrong();
                        }
                    }),
                    map(studentInfo => ({
                        ...rs,
                        firstname: studentInfo.ten,
                        lastname: studentInfo.hoDem,
                        avatar: studentInfo.avatar,
                        code: studentInfo.maHocVien,
                    }))
                );
            }

            return of(rs);
        }),
        shareReplay()
    );

    readonly isLogin$: Observable<boolean | null> = this.auth.clearUserInfo$.pipe(
        switchMap(isClear => {
            if (isClear) {
                return of(false);
            }

            return this.userInfo$.pipe(map(rs => !!rs)).pipe(
                tap(res => {
                    if (!res) {
                        this.storageService.clear(CourseWebConfig.HOC_VIEN_INFO);
                    }
                })
            );
        })
    );

    readonly totalCourse$ = this.cartService.total$;

    searchControl = new FormControl();
    isSearch = false;

    isToggleMenu = false;

    readonly menuRHM: Menu[] = [
        {
            alias: '/',
            title: 'Trang chủ',
            isActive: false,
            subMenu: [],
        },
        {
            alias: '/tin-tuc',
            title: 'Tin tức',
            isActive: false,
            subMenu: [],
        },
        {
            alias: '/bai-viet',
            title: 'Bài viết',
            isActive: false,
            subMenu: [],
        },
    ];

    readonly menuKTTA: Menu[] = [
        {
            alias: '/',
            title: 'Trang chủ',
            isActive: false,
            subMenu: [],
        },
        {
            alias: '/gioi-thieu',
            title: 'Giới thiệu',
            isActive: false,
            subMenu: this.env.urlGioiThieu ? this.env.urlGioiThieu : [],
            isExpand: false,
        },
        {
            alias: '/thong-bao',
            title: 'Thông báo',
            isActive: false,
            subMenu: [],
        },
        {
            alias: '/tin-tuc',
            title: 'Tin tức',
            isActive: false,
            subMenu: [],
        },
        {
            alias: '/tai-lieu',
            title: 'Tài liệu',
            isActive: false,
            subMenu: this.env.urlTaiLieu ? this.env.urlTaiLieu : [],
            isExpand: false,
        },
        {
            alias: '/tra-cuu-van-bang',
            title: 'Tra cứu',
            isActive: false,
            subMenu: [],
            isExpand: false,
        },
    ];

    serviceName = this.env.serviceName;

    serviceNameRHM = this.env.serviceNameRHM;

    constructor(
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment,
        private auth: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private cartService: CartService,
        private courseService: CourseWebService,
        private settingService: SettingService,
        private title: Title,
        private storageService: StorageService,
        private modal: NzModalService
    ) {}

    private get queryParams(): string {
        const verifier = this.auth.getVerifierCode();
        const params: { [key: string]: string } = {
            response_type: 'code',
            client_id: this.env.client_id,
            redirect_uri: REDIRECT_URL_CALLBACK(window.location.origin),
            code_challenge_method: 'S256',
            // scope: 'internal openid offline_access email user_name last_name first_name id_user avatar',
            scope: this.env.client_scope,
            code_challenge: SecurityUtil.generateSHA256(verifier),
            code_verifier: verifier,
            state: '123',
        };

        return Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
    }

    goToPage(): void {
        this.isToggleMenu = false;
        this.isSearch = false;

        this.menuKTTA.forEach(x => {
            x.isExpand = false;
        });
        this.collapseMenu();
    }

    toggleMenu(): void {
        this.isToggleMenu = !this.isToggleMenu;
        this.menuKTTA.forEach(x => {
            x.isExpand = false;
        });
        this.collapseMenu();
    }

    trackByFunc(index: number, elem: any): string {
        return elem.alias;
    }

    handleMissingImage(event: Event): void {
        (event.target as HTMLImageElement).src = '../assets/images/img/no-avatar.svg';
    }

    signIn(): void {
        window.location.assign(REDIRECT_URL_SSO(this.env.authServer, this.queryParams));
    }

    onLogout(): void {
        this.auth.onLogoutByRedirect();
    }

    onSearchCourses(): void {
        this.router.navigate(['/search'], {
            queryParams: {
                keyword: this.searchControl.value,
            },
        });
        this.isToggleMenu = false;
        this.isSearch = false;
        this.collapseMenu();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onSearchCourses();
        }
    }

    onShowCart(): void {
        this.userInfo$.pipe(take(1)).subscribe(user => {
            if (user) {
                this.router.navigate(['/register-course']);
            } else {
                this.router.navigate(['/register']);
            }
        });
        this.isToggleMenu = false;
        this.isSearch = false;
        this.collapseMenu();
    }

    onFocusIn(): void {
        this.isSearch = true;
        this.inputSearch.nativeElement.focus();
        this.cdr.detectChanges();
    }

    onFocusOut(): void {
        this.isSearch = false;
        this.cdr.detectChanges();
    }

    toggleInput(): void {
        this.isSearch = !this.isSearch;
        setTimeout(() => {
            this.inputElement.nativeElement.focus();
        }, 0);
    }

    hideInput(): void {
        this.isSearch = false;
    }

    expandMenuSub(index: number): void {
        this.menuKTTA[index].isExpand = !this.menuKTTA[index].isExpand;
        const coll = document.getElementsByClassName('collapsible');
        const content = coll[index].children[1] as HTMLElement;
        if (content.style.maxHeight) {
            content.style.maxHeight = '';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    collapseMenu(): void {
        const coll = document.getElementsByClassName('collapsible');
        for (let i = 0; i < coll.length; i++) {
            const content = coll[i].children[1] as HTMLElement;
            if (content) {
                content.style.maxHeight = '';
            }
        }
    }
}
