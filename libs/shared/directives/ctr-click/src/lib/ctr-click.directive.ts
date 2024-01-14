import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ctrl-click]',
})
export class CtrlClickDirective implements OnInit, OnDestroy {
    private unsubscribe: any;

    // tslint:disable-next-line:no-output-rename
    @Output('ctrl-click') ctrlClickEvent = new EventEmitter();

    constructor(private renderer: Renderer2, private element: ElementRef) {}

    ngOnInit(): void {
        this.unsubscribe = this.renderer.listen(this.element.nativeElement, 'click', event => {
            if (event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                // unselect accidentally selected text (browser default behaviour)
                document.getSelection()?.removeAllRanges();

                this.ctrlClickEvent.emit(event);
            }
        });
    }

    ngOnDestroy(): void {
        if (!this.unsubscribe) {
            return;
        }
        this.unsubscribe();
    }
}
