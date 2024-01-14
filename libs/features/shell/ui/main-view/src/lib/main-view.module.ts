import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './main-view.component';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '@asc/features/shell/ui/header';
import { SidebarModule } from '@asc/features/shell/ui/sidebar';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [CommonModule, RouterModule, HeaderModule, SidebarModule, NgxSpinnerModule],
    declarations: [MainViewComponent],
    exports: [MainViewComponent],
})
export class MainViewModule {}
