import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { CourseWebService, SettingService } from '@asc/web/shell/data-access/service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Component({
    selector: 'asc-course-new-post',
    templateUrl: './course-new-post.component.html',
    styleUrls: ['./course-new-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNewPostComponent {
    readonly newPost$ = this.courseWebService.getNewPost('', 4, 1).pipe(map(res => (res ? res.items : [])));

    config: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 24,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 750,
        loop: false,
        loopFillGroupWithBlank: true,
        rewind: true,
        navigation: true,
        breakpoints: {
            1024: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 2,
            },
            640: {
                slidesPerView: 2,
            },
        },
    };

    serviceName = this.env.serviceName;
    serviceNameRHM = this.env.serviceNameRHM;

    constructor(
        @Inject(APP_ENVIRONMENT) private env: AppEnvironment,
        private courseWebService: CourseWebService,
        private settingService: SettingService,
        private router: Router
    ) {}

    trackByFunc(index: number): number {
        return index;
    }
}
