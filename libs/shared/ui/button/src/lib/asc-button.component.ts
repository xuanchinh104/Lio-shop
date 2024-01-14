import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy } from '@angular/core';

export type ButtonIconPosition = 'right' | 'left';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'asc-button',
    templateUrl: './asc-button.component.html',
    styleUrls: ['./asc-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AscButtonComponent implements OnDestroy {
    @Input() btnText!: string;
    @Input() btnIconSvg!: string;
    @Input() btnIconClass!: string;
    @Input() btnClass!: string;
    _isDisabled = false;
    @Input() set isDisabled(value: boolean) {
        setTimeout(() => {
            this._isDisabled = value;
            this.cdr.detectChanges();
        }, 100)

    }
    @Input() isSubmit = false;
    @Input() iconPosition: ButtonIconPosition = 'left';

    _isLoading = false;
    @Input() set isLoading(value: boolean) {
        this._isLoading = value;
        this._isDisabled = value;
        // if (this._isLoading) {
        //     this._isDisabled = value;
        // }
        this.cdr.detectChanges();
    }

    @HostBinding('class')
    get hostClass(): string {
        return this._isDisabled ? 'disabled' : 'enabled';
    }

    constructor(protected cdr: ChangeDetectorRef) {}

    ngOnDestroy(): void {
        this._isLoading = false;
    }

    haltDisabledEvents(event: MouseEvent): void {
        if (this.isDisabled && (event.target as HTMLElement)?.tagName === 'A') {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}
