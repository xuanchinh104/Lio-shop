import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[asFileDrag]',
})
export class DragFileDirective {
    @Output() files: EventEmitter<FileList> = new EventEmitter();

    @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        const dropArea = document.querySelector('.drag-image');
        dropArea?.classList.add('active');
        evt.stopPropagation();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent): void {
        evt.preventDefault();
        const dropArea = document.querySelector('.drag-image');
        dropArea?.classList.remove('active');
        evt.stopPropagation();
    }

    @HostListener('drop', ['$event']) onDrop(evt: DragEvent): void {
        evt.preventDefault();
        const dropArea = document.querySelector('.drag-image');
        dropArea?.classList.remove('active');
        evt.stopPropagation();
        if (evt?.dataTransfer) {
            this.files.emit(evt.dataTransfer.files);
        }
    }
}
