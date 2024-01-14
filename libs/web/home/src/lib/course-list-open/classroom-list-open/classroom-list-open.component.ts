import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isLoading, ScriptUtil } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
    selector: 'asc-classroom-list-open',
    templateUrl: './classroom-list-open.component.html',
    styleUrls: ['./classroom-list-open.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomListOpenComponent {
    readonly pageSize$ = new BehaviorSubject<number>(16);
    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly trigger$ = combineLatest([this.pageNumber$, this.pageSize$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getLopHocDaMo(pageSize, pageNumber, 'siSoDangKy').pipe(delay(500))),
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

    constructor(private courseWebService: CourseWebService) {}

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    trackByFunc(index: number): number {
        return index;
    }
}
