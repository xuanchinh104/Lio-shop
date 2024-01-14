import { ChangeDetectionStrategy, Component } from '@angular/core';
import { delay, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { isLoading } from '@asc/shared/utils';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'asc-course-post-detail',
    templateUrl: './course-post-detail.component.html',
    styleUrls: ['./course-post-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursePostDetailComponent {
    readonly param$ = this.route.params.pipe(map(param => param['alias']));

    readonly trigger$ = combineLatest([this.param$]).pipe(shareReplay());

    readonly request$ = this.trigger$.pipe(
        switchMap(([alias]) => this.courseWebService.getNewPost(alias).pipe(delay(500))),
        shareReplay()
    );

    readonly isLoading$ = isLoading(this.trigger$, this.request$);

    readonly title$ = this.request$.pipe(map(res => (res ? res.items[0].tieuDe : '')));

    readonly postDetail$ = this.request$.pipe(
        map(res => (res ? res.items : [])),
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

    constructor(private courseWebService: CourseWebService, private route: ActivatedRoute, private router: Router) {}

    onHistory(): void {
        this.router.navigate(['/bai-viet']);
    }
}
