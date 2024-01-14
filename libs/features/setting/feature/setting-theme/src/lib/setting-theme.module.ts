import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingThemeRoute } from './setting-theme.route';
import { SettingThemeComponent } from './setting-theme/setting-theme.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { SliderComponent } from './slider/slider.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormControlModule } from '@asc/shared/ui/form-control';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConvertUrlPipeModule } from '@asc/shared/pipes/convert-url';
import { ImageComponent } from './image/image.component';
import { ListItemComponent } from './list-item/list-item.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AscButtonModule } from '@asc/shared/ui/button';
import { TranslocoModule } from '@ngneat/transloco';
@NgModule({
    declarations: [SettingThemeComponent, SliderComponent, ImageComponent, ListItemComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SettingThemeRoute,
        NzCollapseModule,
        NzIconModule,
        FormControlModule,
        ConvertUrlPipeModule,
        NzSelectModule,
        AscButtonModule,
        TranslocoModule,
    ],
})
export class SettingThemeModule {}
