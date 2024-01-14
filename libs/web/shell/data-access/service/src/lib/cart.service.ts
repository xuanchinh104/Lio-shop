import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CourseWebService } from './course-web.service';
import { StorageService } from '@asc/shared/services/storage';
import { LopHoc } from '@asc/web/shell/data-access/models';
import { map } from 'rxjs/operators';
import { CourseWebConfig } from '@asc/web/shell/data-access/constant';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    readonly refresh$ = new BehaviorSubject(false);
    readonly total$ = this.refresh$.pipe(map(() => this.getTotalCourseStorage()));

    constructor(private courseWebService: CourseWebService, private storageService: StorageService) {}

    updateTotal(): void {
        this.refresh$.next(true);
    }

    resetTotal(): void {
        this.storageService.clear(CourseWebConfig.SELECTED_COURSES);
        this.refresh$.next(true);
    }

    private getTotalCourseStorage(): number {
        const lopHocs: LopHoc[] | null = this.storageService.retrieve(CourseWebConfig.SELECTED_COURSES);
        if (lopHocs) {
            return lopHocs.length;
        }
        return 0;
    }
}
