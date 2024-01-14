import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { isLoading, ScriptUtil } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';

@Component({
    selector: 'asc-course-post',
    templateUrl: './course-post.component.html',
    styleUrls: ['./course-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursePostComponent {
    readonly pageSize$ = new BehaviorSubject<number>(10);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly trigger$ = combineLatest([this.pageNumber$, this.pageSize$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getNewPost('', pageSize, pageNumber).pipe(delay(500))),
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

    readonly baiViets$ = this.request$.pipe(map(rs => rs.items ?? []));

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    constructor(private courseWebService: CourseWebService) {}

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    trackByFunc(index: number): number {
        return index;
    }
}
