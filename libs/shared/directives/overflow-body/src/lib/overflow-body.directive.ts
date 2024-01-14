import { Directive, OnDestroy, OnInit } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[overflowBody]',
})
export class OverflowBodyDirective implements OnInit, OnDestroy {
    ngOnInit(): void {
        document.body.classList.add('scrollbar');
    }

    ngOnDestroy(): void {
        document.body.classList.remove('scrollbar');
    }
}
