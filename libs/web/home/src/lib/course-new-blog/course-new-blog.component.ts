import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-new-blog',
    templateUrl: './course-new-blog.component.html',
    styleUrls: ['./course-new-blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNewBlogComponent {
    isLoading$ = new BehaviorSubject<boolean>(true);
    tinTucs$ = this.courseService.getNewBlog(6, 1).pipe(
        map(res => res.items),
        finalize(() => this.isLoading$.next(false))
    );

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private courseService: CourseWebService) {}

    trackByFunc(index: number): number {
        return index;
    }
}
