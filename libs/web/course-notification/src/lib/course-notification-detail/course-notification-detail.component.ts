import { ChangeDetectionStrategy, Component } from '@angular/core';
import { delay, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { isLoading } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'asc-course-notification-detail',
    templateUrl: './course-notification-detail.component.html',
    styleUrls: ['./course-notification-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNotificationDetailComponent {
    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly pageSize$ = new BehaviorSubject<number>(16);
    readonly pageNumber$ = new BehaviorSubject<number>(1);
    readonly trigger$ = combineLatest([this.pageNumber$, this.pageSize$, this.param$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize, alias]) => this.courseWebService.getNewBlog(pageSize, pageNumber, alias).pipe(delay(500))),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly tieuDe$ = this.request$.pipe(map(res => (res ? res.items[0].tieuDe : '')));

    readonly chiTietTinTuc$ = this.request$.pipe(
        map(res => res.items ?? []),
        tap(res => {
            if (res.length > 0) {
                setTimeout(() => {
                    const el = document.querySelector('.view-image') as HTMLElement;
                    if (el) {
                        el.classList.add(
                            'ck-blurred',
                            'ck',
                            'ck-content',
                            'ck-editor__editable',
                            'ck-rounded-corners',
                            'ck-editor__editable_inline'
                        );
                    }
                }, 0);
            }
        })
    );

    readonly tinLienQuan$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getNewBlog(8, pageNumber).pipe(delay(500))),
        map(res => (res ? res.items : [])),
        shareReplay()
    );

    constructor(private courseWebService: CourseWebService, private route: ActivatedRoute, private router: Router) {}

    onHistory(): void {
        this.router.navigate(['/thong-bao']);
    }
}
