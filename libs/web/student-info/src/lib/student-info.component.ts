import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'asc-student-info',
    templateUrl: './student-info.component.html',
    styleUrls: ['./student-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentInfoComponent {}
