import { Component } from '@angular/core';
import { FontEnum, FontName } from '../../../dashboard.enum';
import { DashboardService } from '../../../dashboard.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'ui-font-family',
    templateUrl: './font-family.component.html',
    styleUrls: ['./font-family.component.scss'],
})
export class FontFamilyComponent {
    visible = false;

    fontDescription = FontName;
    fontList = [FontEnum.INTER, FontEnum.ROBOTO, FontEnum.TIMESNEW];
    config = this.dashboardService.getConfig();
    readonly fontCurrent$ = this.dashboardService.configUI$.pipe(map(rs => this.fontDescription[rs.font ?? FontEnum.INTER]));

    constructor(private dashboardService: DashboardService) {}

    onShowFontList(): void {
        this.visible = false;
    }

    setFontFamily(font: FontEnum): void {
        this.config.font = font;
        this.dashboardService.setConfig(this.config);
        this.visible = false;
    }
}
