import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LANG_ENUM } from '@asc/shared/modules/translate';
import { TranslocoService } from '@ngneat/transloco';
import { AuthConfig } from '@asc/core/auth/services';
import { StorageService } from '@asc/shared/services/storage';

@Component({
    selector: 'ui-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageComponent implements OnInit {
    langEnum = LANG_ENUM;
    currentLang = LANG_ENUM.VI;
    visible = false;

    constructor(private cdr: ChangeDetectorRef, private storageService: StorageService, private translocoService: TranslocoService) {}

    ngOnInit(): void {
        this.currentLang = this.translocoService.getActiveLang();
    }

    onHide(): void {
        this.visible = false;
    }

    setLanguage(lang: string): void {
        this.currentLang = lang;
        this.translocoService.setActiveLang(lang);
        this.storageService.store(AuthConfig.SESSION_LANG, lang);
        this.visible = false;
    }
}
