import { Component } from '@angular/core';

@Component({
    selector: 'asc-system',
    template: `
        <div class="relative min-h-[100%] bg-[#ebecef]">
            <asc-header></asc-header>
            <div class="bg-[#fdfdfd] w-[250px] z-[9] top-[50px] bottom-0 fixed">
                <asc-menu-left></asc-menu-left>
            </div>
            <div class="ml-[250px] p-[24px]">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
    styleUrls: ['./system.component.scss'],
})
export class SystemComponent {}
