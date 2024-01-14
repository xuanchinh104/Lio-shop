import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'asc-wrap-form',
    templateUrl: './wrap-form.component.html',
    styleUrls: ['./wrap-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapFormComponent {
    @Input() showZoom = true;
    @Input() key!: string;
    @Output() closeForm = new EventEmitter();
    @Output() zoomForm = new EventEmitter();

    isZoom = false;

    onClose(): void {
        this.closeForm.emit();
    }

    onZoom(): void {
        this.isZoom = !this.isZoom;
        this.zoomForm.emit(this.isZoom);
    }
}
