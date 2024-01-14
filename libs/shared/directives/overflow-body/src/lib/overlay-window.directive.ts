import { AfterViewInit, Directive, OnDestroy } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[overlayWindow]',
})
export class OverlayWindowDirective implements OnDestroy, AfterViewInit {
    overlay = document.querySelector('.k-overlay') as HTMLElement;
    private currentOverlayZindex?: string;

    ngOnDestroy(): void {
        this.setOverlayzIndex();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.startOverlay();
        }, 0);
    }

    private setOverlayzIndex(): void {
        if (this.overlay?.style && this.overlay instanceof HTMLElement) {
            this.overlay.style.zIndex = <string>this.currentOverlayZindex;
        }
    }

    private startOverlay(): void {
        this.overlay = document.querySelector('.k-overlay') as HTMLElement;
        const element = document.querySelector('kendo-window:last-child') as HTMLElement;
        const previousElement = element.previousElementSibling as HTMLElement;
        if (this.overlay?.style) {
            this.overlay.style.zIndex = element.style.zIndex;
            this.currentOverlayZindex = previousElement.style.zIndex;
        }
    }
}
