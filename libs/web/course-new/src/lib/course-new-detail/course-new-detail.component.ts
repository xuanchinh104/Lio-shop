import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { delay, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute, Router } from '@angular/router';
import { isLoading } from '@asc/shared/utils';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-new-detail',
    templateUrl: './course-new-detail.component.html',
    styleUrls: ['./course-new-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNewDetailComponent {
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

    readonly requestKTTA$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize, alias]) => this.courseWebService.getNewPost(alias, pageSize, pageNumber).pipe(delay(500))),
        shareReplay()
    );

    readonly isLoadingKTTA$ = isLoading(this.trigger$, this.request$);

    readonly tieuDeKTTA$ = this.requestKTTA$.pipe(map(res => (res ? res.items[0].tieuDe : '')));

    readonly chiTietTinTucKTTA$ = this.requestKTTA$.pipe(
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

    readonly tinLienQuanKTTA$ = this.trigger$.pipe(
        switchMap(([pageNumber, pageSize]) => this.courseWebService.getNewPost('', pageSize, pageNumber).pipe(delay(500))),
        map(res => (res ? res.items : [])),
        shareReplay()
    );

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    onHistory(): void {
        this.router.navigate(['/tin-tuc']);
    }
}
