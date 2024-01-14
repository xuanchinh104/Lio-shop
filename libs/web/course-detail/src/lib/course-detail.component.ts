import { Component, Inject } from '@angular/core';
import { delay, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { isLoading, ScriptUtil, SecurityUtil } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent {
    serviceName = this.env.serviceName;

    serviceNameRHM = this.env.serviceNameRHM;

    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly nameGroup$ = this.route.params.pipe(map(param => SecurityUtil.get(param['key'])));

    readonly pageSize$ = new BehaviorSubject<number>(10);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly trigger$ = combineLatest([this.param$, this.pageSize$, this.pageNumber$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([alias, pageSize, pageNumber]) =>
            this.courseWebService.getLopHocInGroupKhoa(alias, pageSize, pageNumber).pipe(delay(500))
        ),
        shareReplay()
    );

    readonly total$ = this.request$.pipe(map(rs => rs.pagingInfo?.totalItems ?? 0));

    readonly isShowPaging$ = this.request$.pipe(
        map(rs => {
            if (rs?.pagingInfo?.totalItems && rs?.pagingInfo?.pageSize) {
                return rs.pagingInfo.totalItems / rs.pagingInfo.pageSize > 1;
            }
            return false;
        })
    );

    aliasPhong!: string;
    aliasNhom!: string;

    readonly courses$ = this.request$.pipe(
        tap(res => {
            this.aliasPhong = res.infoKhoa.aliasPhong;
            this.aliasNhom = res.infoKhoa.aliasNhom;
        }),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly courseGroupName$ = this.request$.pipe(map(rs => rs.infoKhoa.tenKhoaHoc ?? ''));

    readonly title$ = this.request$.pipe(map(rs => rs.infoKhoa.tieuDe ?? ''));

    private destroyed$ = new Subject();

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private route: ActivatedRoute,
        private courseWebService: CourseWebService,
        private router: Router
    ) {}

    trackByFunc(index: number): number {
        return index;
    }

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    onSelectPhongBan(): void {
        if (this.serviceName === this.serviceNameRHM) {
            this.router.navigate(['/course-group', this.aliasPhong]);
        } else {
            this.router.navigate(['/course-group', this.aliasNhom]);
        }
    }
}
