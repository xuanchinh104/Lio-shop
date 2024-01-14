import { ChangeDetectionStrategy, Component } from '@angular/core';
import SwiperCore, { Autoplay, EffectCreative, SwiperOptions } from 'swiper';
import { SettingService } from '@asc/web/shell/data-access/service';
import { KeyConfigWeb } from '@asc/web/shell/data-access/constant';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

SwiperCore.use([Autoplay, EffectCreative]);

@Component({
    selector: 'asc-course-banner',
    templateUrl: './course-banner.component.html',
    styleUrls: ['./course-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseBannerComponent {
    bannerImg$ = this.settingService.getValueByKey(KeyConfigWeb.SLIDE).pipe(
        map(rs => {
            if (rs) {
                return JSON.parse(rs).map((item: any) => ({
                    ...item,
                    Link: item.Link === '#' ? '/' : item.Link,
                }));
            }

            return [];
        })
    );

    listBanner = [
        {
            img: 'https://in.flowercorner.vn/uploads/P649ea8ef2ed4f0.09844576.webp',
        },
        {
            img: 'https://in.flowercorner.vn/uploads/P657fd247737038.75342862.webp',
        },
        {
            img: 'https://in.flowercorner.vn/uploads/P649eaa1a58adb8.34446721.webp',
        },
    ];

    config: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 32,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        speed: 1000,
        grabCursor: true,
        loop: true,
        loopFillGroupWithBlank: true,
        rewind: true,
        navigation: false,
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: [0, 0, -300],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
    };

    constructor(private settingService: SettingService, private router: Router) {}

    trackByFunc(index: number): number {
        return index;
    }

    redirectLink(item: any): void {
        const link = item.Link as string;
        if (link === '#') {
            return;
        }

        if (link.startsWith('http://') || link.startsWith('https://')) {
            window.open(link, '_blank');
            return;
        }

        this.router.navigate([link]);
    }
}
