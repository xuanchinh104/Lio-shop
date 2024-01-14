import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { CourseGroupComponent } from './course-group/course-group.component';
import { CourseItemModule } from '@asc/web/shared/ui/course-item';
import { CourseSkeletonModule } from '@asc/web/shared/ui/course-skeleton';
import { SwiperModule } from 'swiper/angular';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { CourseCarouselComponent } from './course-carousel/course-carousel.component';
import { CarouselItemComponent } from './course-carousel/carousel-item/carousel-item.component';
import { CourseBannerComponent } from './course-banner/course-banner.component';
import { TranslocoModule } from '@ngneat/transloco';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CourseNewBlogComponent } from './course-new-blog/course-new-blog.component';
import { CourseNewPostComponent } from './course-new-post/course-new-post.component';
import { CourseNewItemModule } from '@asc/web/shared/ui/course-new-item';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { CourseListOpenComponent } from './course-list-open/course-list-open.component';
import { CurrencyFormatModule } from '@asc/web/shell/data-access/pipes/currency';
import { ClassroomListOpenComponent } from './course-list-open/classroom-list-open/classroom-list-open.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ClassroomListNewComponent } from './course-list-open/classroom-list-new/classroom-list-new.component';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { CoursePostItemModule } from '@asc/web/shared/ui/course-post-item';

const LIBs = [
    CommonModule,
    CourseItemModule,
    CourseSkeletonModule,
    SwiperModule,
    ConvertUrlModule,
    NzToolTipModule,
    TranslocoModule,
    CourseNewItemModule,
    SvgIconsModule,
    CurrencyFormatModule,
    NzPaginationModule,
    SafeHtmlPipeModule,
    CoursePostItemModule,
];

const UIs = [
    HomeComponent,
    CourseGroupComponent,
    CourseCarouselComponent,
    CourseBannerComponent,
    CarouselItemComponent,
    CourseNewBlogComponent,
    CourseNewPostComponent,
    CourseListOpenComponent,
    ClassroomListOpenComponent,
    ClassroomListNewComponent,
];

@NgModule({
    imports: [
        ...LIBs,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'danh-sach-cac-lop-dang-mo',
                component: ClassroomListOpenComponent,
            },
            {
                path: 'danh-sach-cac-lop-moi',
                component: ClassroomListNewComponent,
            },
        ]),
    ],
    declarations: [...UIs],
    exports: [...UIs],
})
export class HomeModule {}
