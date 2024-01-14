import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { DashboardService } from './dashboard.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuTopComponent } from './_components/menu-top/menu-top.component';
import { TimerComponent } from './_components/timer/timer.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { LayoutComponent } from './_components/layout/layout.component';
import { DashboardV1Component } from './verion/dashboard-v1/dashboard-v1.component';
import { DashboardV2Component } from './verion/dashboard-v2/dashboard-v2.component';
import { MenuLeftComponent } from './_components/menu-left/menu-left.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AscButtonModule } from '@asc/shared/ui/button';
import { OverflowBodyModule } from '@asc/shared/directives/overflow-body';
import { SafeHtmlPipeModule } from '@asc/shared/pipes/safe-html';
import { TranslateModule } from '@asc/shared/modules/translate';
import { HeaderModule } from '@asc/features/shell/ui/header';
import { IconModule } from '@asc/shared/ui/icon';
import { DropdownUserComponent } from './_components/dropdown-user/dropdown-user.component';
import { DropdownSettingComponent } from './_components/dropdown-setting/dropdown-setting.component';
import { FontFamilyComponent } from './_components/dropdown-setting/font-family/font-family.component';
import { ThemeComponent } from './_components/dropdown-setting/theme/theme.component';
import { LanguageComponent } from './_components/dropdown-setting/language/language.component';
import { TopicComponent } from './_components/layout/topic/topic.component';
import { ColorBannerComponent } from './_components/layout/color-banner/color-banner.component';
import { SampleComponent } from './_components/layout/sample/sample.component';
import { SwiperModule } from 'swiper/angular';

export const DashboardRouting = RouterModule.forChild([
    {
        path: '',
        component: DashboardComponent,
        data: {
            title: 'Dashboard',
        },
    },
]);

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverflowBodyModule,
        SafeHtmlPipeModule,
        NzDropDownModule,
        HeaderModule,
        NzTabsModule,
        DashboardRouting,
        NzPopoverModule,
        AscButtonModule,
        IconModule,
        SwiperModule,
    ],
    declarations: [
        DashboardComponent,
        MenuTopComponent,
        TimerComponent,
        LayoutComponent,
        DashboardV1Component,
        DashboardV2Component,
        MenuLeftComponent,
        DropdownUserComponent,
        DropdownSettingComponent,
        FontFamilyComponent,
        ThemeComponent,
        LanguageComponent,
        TopicComponent,
        ColorBannerComponent,
        SampleComponent,
    ],
    providers: [DashboardService],
})
export class DashboardModule {}
