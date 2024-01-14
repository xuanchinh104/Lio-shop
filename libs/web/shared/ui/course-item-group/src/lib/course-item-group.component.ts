import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { KhoaHoc } from '@asc/web/shell/data-access/models';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SecurityUtil } from '@asc/shared/utils';

@Component({
    selector: 'asc-course-item-group',
    templateUrl: './course-item-group.component.html',
    styleUrls: ['./course-item-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseItemGroupComponent implements OnDestroy {
    @Input() item?: KhoaHoc;
    // @Input() typeView!: 'list' | 'grid';
    @Input() view!: 'home' | 'list';

    @Input() alias!: string;

    @Input() nameGroup!: string;

    private destroyed$ = new Subject();

    constructor(private router: Router) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onViewDetailCourse(item: KhoaHoc): void {
        const hashNameGroup = SecurityUtil.set(this.nameGroup);
        if (hashNameGroup) {
            this.router.navigate(['/course-group', hashNameGroup, item.alias]);
        }
    }
}
