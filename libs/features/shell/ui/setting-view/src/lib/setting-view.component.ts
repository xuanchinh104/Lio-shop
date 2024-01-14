import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslocoService } from '@ngneat/transloco';
import { Column, COLUMN_KEY } from '@asc/features/shell/data-access/state';
import { ColumnDB, DbService } from '@asc/shared/services/index-db';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '@asc/shared/services/common';
import { StorageService } from '@asc/shared/services/storage';

@Component({
    selector: 'asc-setting-view',
    templateUrl: './setting-view.component.html',
    styleUrls: ['./setting-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingViewComponent {
    @Input() columnDefaults: Column[] = [];

    @Input() set columnKendo(cols: Column[]) {
        if (cols) {
            this.columnSetting = this.assignArray(cols);
            this.columnSearch = this.assignArray(cols);
        }
    }

    @Input() columnKey!: string;
    @Output() saveSetting = new EventEmitter<Column[]>();
    @Output() closeSet = new EventEmitter<boolean>();
    columnSetting: Column[] = [];
    keyword = new FormControl();

    columnSearch: Column[] = [];

    private destroyed$ = new Subject();

    constructor(
        private translocoService: TranslocoService,
        private dbService: DbService,
        private noti: NotificationService,
        private storage: StorageService,
        private cdr: ChangeDetectorRef
    ) {}

    // đóng
    closeSetting(isClose = false): void {
        this.closeSet.emit(isClose);
    }

    // search
    onSearchColumn(): void {
        const value = this.keyword.value;
        const column = this.assignArray(this.columnSearch);

        this.columnSetting = column.filter(
            x => this.translocoService.translate(x.title)?.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        column.forEach(x => {
            const index = this.columnSetting.findIndex(m => m.field === x.field);
            if (index > -1) {
                this.columnSetting[index].isChecked = x.isChecked;
            }
        });
    }

    // sắp xếp vị trí
    drop(event: CdkDragDrop<Column[]>): void {
        moveItemInArray(this.columnSetting, event.previousIndex, event.currentIndex);
        this.cdr.detectChanges();
    }

    // trả về mặc định
    onDefaultSetting(): void {
        this.columnSetting = this.columnDefaults;
        this.keyword.setValue('');
        if (!window.indexedDB) {
            this.columnLocalStorage(this.columnDefaults);
        } else {
            this.dbService
                .updateColumnObs({
                    key: this.columnKey,
                    columns: this.columnDefaults,
                })
                .pipe(takeUntil(this.destroyed$))
                .subscribe(
                    () => this.saveSetting.emit(this.columnDefaults),
                    error => {
                        this.columnLocalStorage(this.columnDefaults);
                    }
                );
        }
    }

    // save setting
    onSaveSetting(): void {
        const columnsChecked = this.columnSetting.filter(x => x.isChecked);
        const columnLocked = columnsChecked.filter(x => x.isLocked);
        if (columnsChecked.length >= 1) {
            if (columnsChecked.length > columnLocked.length) {
                if (!window.indexedDB) {
                    this.columnLocalStorage(this.columnSetting);
                    this.closeSetting();
                } else {
                    this.dbService
                        .updateColumnObs({
                            key: this.columnKey,
                            columns: this.columnSetting,
                        })
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(
                            () => {
                                this.saveSetting.emit(this.columnSetting);
                                this.closeSetting();
                            },
                            error => {
                                this.columnLocalStorage(this.columnSetting);
                                this.closeSetting();
                            }
                        );
                }
            } else {
                this.noti.showWarningMessage(this.translocoService.translate('LB.WARNING_SETTING_1'));
            }
        } else {
            this.noti.showWarningMessage(this.translocoService.translate('LB.WARNING_SETTING_2'));
        }
    }

    change(event: boolean, item: Column): void {
        const index = this.columnSearch.findIndex(x => x.field === item.field);
        if (index > -1) {
            this.columnSearch[index].isChecked = event;
        }
    }

    private columnLocalStorage(columns: Column[]): void {
        const data = this.storage.retrieve<ColumnDB[]>(COLUMN_KEY.COLUMN_KEY);
        const newArray = data?.filter(x => x.key === this.columnKey);
        if (data && data.length > 0 && newArray && newArray.length > 0) {
            newArray[0].columns = columns;
            const indexData = data.findIndex(x => x.key === newArray[0].key);
            data[indexData] = newArray[0];
            this.storage.store(COLUMN_KEY.COLUMN_KEY, data);
            this.saveSetting.emit(columns);
        }
    }

    private assignArray(arr: Column[]): Column[] {
        return arr.map(x => Object.assign({}, x));
    }
}
