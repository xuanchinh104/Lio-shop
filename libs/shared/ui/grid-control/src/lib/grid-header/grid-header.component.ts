import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuSelector } from '@asc/features/shell/data-access/state';
import { Title } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { RoleAction } from '@asc/core/auth/data-access';

@Component({
    selector: 'asc-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridHeaderComponent {
    @Input() isIcon = true;
    @Input() isHiddenAction = true;
    @Input() keyTranslate = 'BTN.ADD';
    @Input() isSync = false;
    @Output() triggerHandler = new EventEmitter();
    @Output() syncPhongBan = new EventEmitter();

    readonly pageInfo$ = this.menuSelector.pageInfo$.pipe(
        tap(rs => {
            this.title.setTitle(`CTUMP | ${rs?.f_Name}` ?? '');
        })
    );

    readonly roleAction = RoleAction;
    constructor(private menuSelector: MenuSelector, private title: Title) {}

    onHandlerEvent(): void {
        this.triggerHandler.emit();
    }

    onAsyncPhongBan(): void {
        this.syncPhongBan.emit();
    }
}
