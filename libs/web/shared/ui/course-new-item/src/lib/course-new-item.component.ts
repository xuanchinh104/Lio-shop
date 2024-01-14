import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { TinTucForWeb } from '@asc/web/shell/data-access/models';
import { Router } from '@angular/router';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-new-item',
    templateUrl: './course-new-item.component.html',
    styleUrls: ['./course-new-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNewItemComponent {
    @Input() item!: TinTucForWeb;
    @Input() isViewDetail = false;
    @Input() isNewRelated = false;

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;
    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private router: Router) {}

    viewDetailNews(item: TinTucForWeb): void {
        this.router.navigate(['/tin-tuc', item.alias]);
    }
}
