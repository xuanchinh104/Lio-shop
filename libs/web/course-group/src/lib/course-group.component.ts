import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isLoading, ScriptUtil, SecurityUtil } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { delay, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NhomKhoaHoc } from '@asc/web/shell/data-access/models';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-group',
    templateUrl: './course-group.component.html',
    styleUrls: ['./course-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseGroupComponent {
    serviceName = this.env.serviceName;

    serviceNameRHM = this.env.serviceNameRHM;

    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly pageSize$ = new BehaviorSubject<number>(8);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly trigger$ = combineLatest([this.param$, this.pageSize$, this.pageNumber$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([alias, pageSize, pageNumber]) =>
            this.courseWebService.getCourseByDepartment(alias, pageSize, pageNumber).pipe(delay(500))
        ),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly courses$ = this.request$.pipe(map(res => (res ? res[0].items : [])));

    tenPhongBan!: string;

    readonly coursesGroupName$ = this.request$.pipe(
        map(res => (res ? res[0].info.tenPhongBan : '')),
        tap(res => (this.tenPhongBan = res))
    );

    readonly requestNhomKhoaHoc$ = this.trigger$.pipe(
        switchMap(([alias, pageSize, pageNumber]) => this.courseWebService.getCoursePaging(alias, pageSize, pageNumber).pipe(delay(500))),
        shareReplay()
    );

    readonly isLoadingNhom$ = isLoading(this.trigger$, this.requestNhomKhoaHoc$);

    readonly nhomKhoaHocs$ = this.requestNhomKhoaHoc$.pipe(map(rs => (rs ? rs.items : [])));

    readonly coursesGroupNameNhom$ = this.requestNhomKhoaHoc$.pipe(map(res => (res ? res.info.title : '')));

    readonly total$ = this.requestNhomKhoaHoc$.pipe(map(rs => rs.pagingInfo?.totalItems ?? 0));

    readonly isShowPaging$ = this.requestNhomKhoaHoc$.pipe(
        map(rs => {
            if (rs?.pagingInfo?.totalItems && rs?.pagingInfo?.pageSize) {
                return rs.pagingInfo.totalItems / rs.pagingInfo.pageSize > 1;
            }
            return false;
        })
    );

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

    showListCourse(group: NhomKhoaHoc): void {
        this.param$
            .pipe(
                tap(res => {
                    const hashNameGroup = SecurityUtil.set(this.tenPhongBan);
                    const hashAliasGroup = SecurityUtil.set(res);
                    if (hashNameGroup || hashAliasGroup) {
                        this.router.navigate(['/course', hashNameGroup, hashAliasGroup, group.alias]);
                    }
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }
}
