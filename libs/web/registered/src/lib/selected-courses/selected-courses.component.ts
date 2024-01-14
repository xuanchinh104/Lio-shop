import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageService } from '@asc/shared/services/storage';
import { LopHoc } from '@asc/web/shell/data-access/models';
import { CartService } from '@asc/web/shell/data-access/service';
import { CourseWebConfig } from '@asc/web/shell/data-access/constant';
import { SafeAny } from '@asc/shared/utils';

interface MapData {
    id: number;
    children: LopHoc[];
}

@Component({
    selector: 'asc-selected-courses',
    templateUrl: './selected-courses.component.html',
    styleUrls: ['./selected-courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedCoursesComponent implements OnInit {
    @Output() courses = new EventEmitter<LopHoc[]>();
    selectedCourses: MapData[] = [];

    constructor(private storageService: StorageService, private cartService: CartService) {}

    ngOnInit(): void {
        const selectedCoursed: LopHoc[] | null = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES);
        if (selectedCoursed) {
            this.courses.emit(selectedCoursed);
            this.mapDataLopHocSelected(selectedCoursed);
        }
    }

    trackByFunc(index: number): number {
        return index;
    }

    onRemoveCourse(id: number): void {
        const courseIndex = this.selectedCourses.findIndex(course => course.id === id);
        if (courseIndex > -1) {
            this.selectedCourses.splice(courseIndex, 1);
            const newArr = this.selectedCourses.map(x => x.children);
            const arrItem = newArr.reduce((result, arr) => result.concat(arr), []) as LopHoc[];
            this.storageService.store(CourseWebConfig.SELECTED_COURSES, arrItem);
            this.courses.emit(arrItem);
        }
        this.cartService.updateTotal();
    }

    private mapDataLopHocSelected(data: LopHoc[]): MapData[] {
        const groupedArray: { [keyId: number]: SafeAny[] } = {};
        data.forEach(item => {
            if (item.idLoaiMienGiam === 2) {
                const itemId = item.idCombo ? item.idCombo : item.id;
                if (groupedArray[itemId]) {
                    groupedArray[itemId].push(item);
                } else {
                    groupedArray[itemId] = [item];
                }
            } else {
                const resultItem = {
                    id: item.id,
                    children: [item],
                } as MapData;
                this.selectedCourses.push(resultItem);
            }
        });

        // eslint-disable-next-line guard-for-in
        for (const itemId in groupedArray) {
            const group = groupedArray[itemId] as LopHoc[];
            const resultItem = {
                id: Number(itemId),
                children: group,
            } as MapData;
            this.selectedCourses.push(resultItem);
        }
        return this.selectedCourses;
    }
}
