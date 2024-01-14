import { ChangeDetectionStrategy, Component } from '@angular/core';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { PhongBan } from '@asc/features/catalog/data-access';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
    selector: 'asc-course-carousel',
    templateUrl: './course-carousel.component.html',
    styleUrls: ['./course-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCarouselComponent {
    phongBan!: PhongBan;
}
