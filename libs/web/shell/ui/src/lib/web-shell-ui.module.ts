import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TranslateModule } from '@asc/shared/modules/translate';
import { IconModule } from '@asc/shared/ui/icon';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { ConvertUrlModule } from '@asc/web/shell/data-access/pipes/convert-url';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CapitalizeNameModule } from '@asc/web/shared/ui/capitalize-name';
import { NgxSpinnerModule } from 'ngx-spinner';

const LIBs = [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SvgIconsModule,
    TranslateModule,
    IconModule,

    NzModalModule,
    NzSkeletonModule,
    NzDropDownModule,
    NzBackTopModule,
    ConvertUrlModule,
];

const UIs = [HeaderComponent, FooterComponent, LayoutComponent];

@NgModule({
    imports: [...LIBs, NzToolTipModule, CapitalizeNameModule, NgxSpinnerModule],
    declarations: [...UIs],
    exports: [HeaderComponent, FooterComponent],
})
export class WebShellUIModule {}
