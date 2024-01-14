import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeTopics } from '../../../dashboard.enum';
import { ConfigUI } from '../../../_models/config-ui.model';
import SwiperCore, { Autoplay, Navigation, Pagination, SwiperOptions } from 'swiper';

SwiperCore.use([
    Navigation,
    Pagination,
    Autoplay,
]);

@Component({
    selector: 'ui-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicComponent {
    configUI: ConfigUI | null = null;
    @Input() set config(value: ConfigUI) {
        this.configUI = value;
    }

    configSwiper: SwiperOptions = {
        slidesPerView: 4,
        spaceBetween: 10,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        allowTouchMove: false,
        speed: 1000,
        loop: true,
        navigation: true,
        pagination: { clickable: true },
    };

    backgrounds = ThemeTopics;
    @Output() selectTopic = new EventEmitter();
    onSelectTopic(img: string): void {
        this.selectTopic.emit(img);
    }


}
