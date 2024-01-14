import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaiVietForWeb } from '@asc/web/shell/data-access/models';
import { Router } from '@angular/router';

@Component({
    selector: 'asc-course-post-item',
    templateUrl: './course-post-item.component.html',
    styleUrls: ['./course-post-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursePostItemComponent {
    @Input() item!: BaiVietForWeb;

    @Input() view = 'grid';

    constructor(private router: Router) {}

    showDetailPost(item: BaiVietForWeb): void {
        this.router.navigate(['/bai-viet', item.alias]);
    }
}
