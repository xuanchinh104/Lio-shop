import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { isLoading, ScriptUtil, SecurityUtil } from '@asc/shared/utils';

@Component({
    selector: 'asc-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent {
    readonly pageSize$ = new BehaviorSubject<number>(16);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly keyword$ = new BehaviorSubject('');

    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly tenNhom$ = this.route.params.pipe(map(param => SecurityUtil.get(param['key'])));

    readonly aliasPhong$ = this.route.params.pipe(map(param => SecurityUtil.get(param['aliasPhong'])));

    readonly trigger$ = combineLatest([this.param$, this.pageNumber$, this.pageSize$, this.keyword$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([alias, pageNumber, pageSize, keyword]) =>
            this.courseWebService.getCoursePaging(alias, pageSize, pageNumber, keyword).pipe(delay(500))
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

    readonly courses$ = this.request$.pipe(map(rs => rs.items ?? []));

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly courseGroupName$ = this.request$.pipe(map(rs => rs.info.title ?? ''));

    private destroyed$ = new Subject();

    constructor(
        private courseWebService: CourseWebService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {}

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    onSelectGroup(): void {
        this.aliasPhong$.pipe(takeUntil(this.destroyed$)).subscribe(aliasPhong => {
            this.router.navigate(['/course-group', aliasPhong]);
        });
    }

    trackByFunc(index: number): number {
        return index;
    }
}
