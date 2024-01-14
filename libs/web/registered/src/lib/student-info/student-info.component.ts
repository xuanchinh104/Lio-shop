import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoaiDoiTuongDescription } from '@asc/shared/data-access';
import { HocVien } from '@asc/web/shell/data-access/models';

@Component({
    selector: 'asc-student-info',
    templateUrl: './student-info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentInfoComponent {
    @Input() studentInfo!: HocVien;

    loaiDoiTuongDescription = LoaiDoiTuongDescription;
}
