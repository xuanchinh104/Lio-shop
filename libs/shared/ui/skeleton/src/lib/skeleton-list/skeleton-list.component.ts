import { Component, Input } from '@angular/core';

export type SkeletonType = 'DASHBOARD' | 'GRID' | 'FORM';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'skeleton-list',
    templateUrl: './skeleton-list.component.html',
    styleUrls: ['./skeleton-list.component.scss'],
})
export class SkeletonListComponent {
    isLoading = true;

    @Input() set loading(value: boolean) {
        this.isLoading = value;
    }

    @Input() type: SkeletonType = 'GRID';
}
