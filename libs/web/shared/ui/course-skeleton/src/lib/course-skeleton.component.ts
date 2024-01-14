import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'asc-course-skeleton',
    templateUrl: './course-skeleton.component.html',
    styleUrls: ['./course-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSkeletonComponent {
    listCard: number[] = [];

    @Input() set countItem(count: number) {
        if (count > 0) {
            this.listCard = Array(count).fill(count);
        }
    }

    @Input() classView!: string;

    @Input() type!: 'grid' | 'list' | 'news';

    trackByFunc(index: number): number {
        return index;
    }
}
