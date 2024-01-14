import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingViewComponent } from './setting-view.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AscButtonModule } from '@asc/shared/ui/button';

@NgModule({
    imports: [
        CommonModule,
        NzToolTipModule,
        TranslocoModule,
        SvgIconsModule,
        ReactiveFormsModule,
        DragDropModule,
        NzCheckboxModule,
        FormsModule,
        AscButtonModule,
    ],
    declarations: [SettingViewComponent],
    exports: [SettingViewComponent],
})
export class SettingViewModule {}
