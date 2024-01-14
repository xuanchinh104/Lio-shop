import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LopHocRegistered } from '@asc/web/shell/data-access/models';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CourseWebService } from '@asc/web/shell/data-access/service';

@Component({
    selector: 'asc-course-attachment',
    templateUrl: './course-attachment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseAttachmentComponent {
    courseId$ = new BehaviorSubject<number | null>(null);
    _course: LopHocRegistered | null = null;
    @Input() set course(value: LopHocRegistered | null) {
        if (value) {
            this._course = value;

            this.courseId$.next(value.id);
        }
    }

    readonly courseAttachments$ = this.courseId$.pipe(
        switchMap(id => this.courseService.getCourseRegistedDetail(id ?? 0).pipe(map(rs => rs.hoSoLopHocs)))
    );

    @Output() closeForm = new EventEmitter<boolean>();

    constructor(private courseService: CourseWebService) {}
}
