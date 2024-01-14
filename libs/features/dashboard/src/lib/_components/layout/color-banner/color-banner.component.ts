import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeColorBanner, ThemeColorCode, ThemeColorEnum, ThemeColorName } from '../../../dashboard.enum';
import { ConfigUI } from '../../../_models/config-ui.model';
import SwiperCore, {
    Navigation,
    Pagination,
    Autoplay, SwiperOptions,
} from 'swiper';

SwiperCore.use([
    Navigation,
    Pagination,
    Autoplay,
]);

@Component({
    selector: 'ui-color-banner',
    templateUrl: './color-banner.component.html',
    styleUrls: ['./color-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorBannerComponent {
    configUI: ConfigUI | null = null;
    @Input() set config(value: ConfigUI) {
        this.configUI = value;
    }
    themeColorBanner = ThemeColorBanner;
    themeColorCode = ThemeColorCode;
    themeColorName = ThemeColorName;
    themeColors = [ThemeColorEnum.BLUE, ThemeColorEnum.VIOLET, ThemeColorEnum.GREEN];
    configSwiper: SwiperOptions = {
        slidesPerView: 2,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        allowTouchMove: false,
        speed: 1000,
        loop: true,
        pagination: { clickable: true },
        navigation: true
    };

    @Output() selectThemeColor = new EventEmitter();
    onSelectThemeColor(color: ThemeColorEnum): void {
        this.selectThemeColor.emit(color);
    }

}
