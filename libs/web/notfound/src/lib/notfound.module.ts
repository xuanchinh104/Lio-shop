import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound.component';
import { WebShellUIModule } from '@asc/web/shell/ui';
import { BackgroundComponent } from './background/background.component';

@NgModule({
    declarations: [NotfoundComponent, BackgroundComponent],
    imports: [
        CommonModule,
        WebShellUIModule,
        RouterModule.forChild([
            {
                path: '',
                component: NotfoundComponent,
            },
        ]),
    ],
})
export class WebNotfoundModule {}
