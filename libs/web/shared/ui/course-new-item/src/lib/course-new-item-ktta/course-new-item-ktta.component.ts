import { Component, Inject, Input } from '@angular/core';
import { BaiVietForWeb } from '@asc/web/shell/data-access/models';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { Router } from '@angular/router';

@Component({
    selector: 'asc-course-new-item-ktta',
    templateUrl: './course-new-item-ktta.component.html',
    styleUrls: ['./course-new-item-ktta.component.scss'],
})
export class CourseNewItemKttaComponent {
    @Input() item!: BaiVietForWeb;
    @Input() isViewDetail = false;
    @Input() isNewRelated = false;

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;
    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private router: Router) {}

    viewDetailNews(item: BaiVietForWeb): void {
        this.router.navigate(['/tin-tuc', item.alias]);
    }
}
