import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { isLoading, ScriptUtil } from '@asc/shared/utils';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-new',
    templateUrl: './course-new.component.html',
    styleUrls: ['./course-new.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNewComponent {
    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    readonly pageSize$ = new BehaviorSubject<number>(10);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly trigger$ = combineLatest([this.pageNumber$, this.pageSize$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getNewBlog(pageSize, pageNumber).pipe(delay(500))),
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

    readonly tinTuc$ = this.request$.pipe(map(rs => rs.items ?? []));

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly requestKTTA$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getNewPost('', pageSize, pageNumber).pipe(delay(500))),
        shareReplay()
    );

    readonly totalKTTA$ = this.request$.pipe(map(rs => rs.pagingInfo?.totalItems ?? 0));

    readonly isShowPagingKTTA$ = this.request$.pipe(
        map(rs => {
            if (rs?.pagingInfo?.totalItems && rs?.pagingInfo?.pageSize) {
                return rs.pagingInfo.totalItems / rs.pagingInfo.pageSize > 1;
            }
            return false;
        })
    );

    readonly baiViets$ = this.requestKTTA$.pipe(map(rs => rs.items ?? []));

    readonly isLoadingKTTA$ = isLoading(this.trigger$, this.request$);

    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private courseWebService: CourseWebService) {}

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    trackByFunc(index: number): number {
        return index;
    }
}
