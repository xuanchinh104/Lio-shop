import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { isLoading } from '@asc/shared/utils';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
    selector: 'asc-course-search',
    templateUrl: './course-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSearchComponent {
    readonly pageSize$ = new BehaviorSubject<number>(20);

    readonly pageNumber$ = new BehaviorSubject<number>(1);

    readonly params$ = this.route.queryParams.pipe(map(param => param['keyword']));

    readonly trigger$ = combineLatest([this.params$, this.pageSize$, this.pageNumber$]).pipe(shareReplay());

    readonly courses$ = this.trigger$.pipe(
        switchMap(([keyword, pageSize, pageNumber]) =>
            this.courseService.getLopHocForSearch(keyword, pageSize, pageNumber).pipe(delay(500))
        ),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.courses$);

    constructor(private courseService: CourseWebService, private route: ActivatedRoute) {}

    trackByFunc(index: number): number {
        return index;
    }
}
