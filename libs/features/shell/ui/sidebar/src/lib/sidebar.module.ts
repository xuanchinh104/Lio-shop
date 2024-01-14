import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouterModule } from '@angular/router';
import { AppDockComponent } from './app-dock/app-dock.component';
import { IconModule } from '@asc/shared/ui/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
    imports: [CommonModule, RouterModule, NzToolTipModule, NzDropDownModule, IconModule, NzCollapseModule],
    declarations: [SidebarComponent, AppDockComponent],
    exports: [SidebarComponent, AppDockComponent],
})
export class SidebarModule {}
