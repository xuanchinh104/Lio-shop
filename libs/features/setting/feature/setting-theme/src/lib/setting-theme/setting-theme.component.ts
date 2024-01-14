import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MainSetting, SettingItem, SettingThemeConstant, SettingThemeEnum } from '@asc/features/setting/feature/data-access';
import { CourseService } from '@asc/features/shell/data-access/service';
import { NotificationService } from '@asc/shared/services/common';
import { Subject } from 'rxjs';
import { finalize, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { CatalogConstant, QuyTrinhDangKy } from '@asc/features/catalog/data-access';

@Component({
    selector: 'asc-setting-theme',
    templateUrl: './setting-theme.component.html',
    styleUrls: ['./setting-theme.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingThemeComponent implements OnDestroy {
    settings$ = this.courseService.get(SettingThemeConstant.API.SETTING + `/GetSettingTheme`).pipe(
        map((rs: MainSetting[]) => {
            rs.forEach(parent => {
                parent.nhomCauHinh.forEach(item => {
                    if (item.keyCauHinh === 'FooterContent' && item.valueString) {
                        item.valueObj = JSON.parse(item.valueString);
                    }
                });
            });

            return rs;
        }),
        shareReplay()
    );

    quyTrinhs$ = this.courseService.get(CatalogConstant.QUY_TRINH_DANG_KY).pipe(map(rs => rs.items as QuyTrinhDangKy[]));

    settingThemeEnum = SettingThemeEnum;

    isSubmited = false;

    private destroyed$ = new Subject();

    constructor(private courseService: CourseService, private notification: NotificationService, private cdr: ChangeDetectorRef) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    saveConfig(): void {
        // code here

        this.isSubmited = true;

        this.settings$
            .pipe(
                map((rs: MainSetting[]) => {
                    let result: SettingItem[] = [];
                    rs.forEach(item => (result = result.concat(item.nhomCauHinh)));
                    return result
                        .map(item => ({
                            ...item,
                            valueString: item.keyCauHinh === 'FooterContent' ? JSON.stringify(item.valueObj) : item.valueString,
                        }))
                        .map(item => ({
                            idCauHinh: item.idCauHinh,
                            keyCauHinh: item.keyCauHinh,
                            type: item.loaiCauHinh,
                            valueInt: item.valueInt ?? 0,
                            valueString:
                                item.loaiCauHinh === SettingThemeEnum.GroupQuangCao ? JSON.stringify(item.valueObj) : item.valueString,
                            valueObj: item.loaiCauHinh === SettingThemeEnum.GroupQuangCao ? item.valueObj : [],
                        }));
                }),
                switchMap(rs =>
                    this.courseService.put(SettingThemeConstant.API.SETTING + `/UpdateSettingTheme`, {
                        cultureId: 0,
                        data: rs,
                    })
                ),
                finalize(() => {
                    this.isSubmited = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.notification.showSuccessMessage('Lưu cấu hình thành công');
            });
    }
}
