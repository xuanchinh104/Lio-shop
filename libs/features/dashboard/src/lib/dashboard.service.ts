import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigUI } from './_models/config-ui.model';
import { ConfigUIDefault, FontAlias, FontEnum, ThemeClassName, ThemeColorAlias, ThemeColorEnum, ThemeUIEnum } from './dashboard.enum';
import { StorageService } from '@asc/shared/services/storage';
import { ConfigLayoutKey } from './dashboard.config';

@Injectable()
export class DashboardService {
    configUI$ = new BehaviorSubject(this.getConfig());

    constructor(private storage: StorageService) {}

    setConfig(config: ConfigUI): void {
        this.storage.store<ConfigUI>(ConfigLayoutKey, config);
        this.publishConfig(config);
    }

    getConfig(): ConfigUI {
        const configLayout = this.storage.retrieve<ConfigUI>(ConfigLayoutKey);
        if (!configLayout) {
            // set
            this.storage.store<ConfigUI>(ConfigLayoutKey, ConfigUIDefault);
            this.setThemeAlias(ConfigUIDefault.color);
            return ConfigUIDefault;
        }
        this.setThemeAlias(configLayout.color);
        this.setFontAlias(configLayout.font);
        this.setThemeClassName(configLayout.themeClass);

        return configLayout;
    }

    private publishConfig(config: ConfigUI): void {
        this.setThemeAlias(config.color);
        this.setFontAlias(config.font);
        this.setThemeClassName(config.themeClass);
        this.configUI$.next(config);
    }

    private setThemeAlias(color: ThemeColorEnum): void {
        const name = ThemeColorAlias[color];
        document.querySelector('html')?.setAttribute('data-theme', name);
    }

    private setFontAlias(font: FontEnum): void {
        const name = FontAlias[font];
        document.querySelector('html')?.setAttribute('data-font', name);
    }

    private setThemeClassName(themeClass: ThemeUIEnum): void {
        const name = ThemeClassName[themeClass];
        document.querySelector('html')?.setAttribute('class', name);
    }
}
