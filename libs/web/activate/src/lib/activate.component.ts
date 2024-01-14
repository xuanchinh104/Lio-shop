import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'asc-activate',
    templateUrl: './activate.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateComponent {
    readonly params$ = this.route.params.pipe(map(param => param['key']));

    readonly activate$ = this.params$.pipe(
        switchMap(param => this.courseService.activateStudent(param)),
        catchError(err => of(err)),
        tap(err => {
            if (err?.status === 404) {
                // redirect 404 page
                this.router.navigate(['/404']);
            }
        })
    );

    constructor(private courseService: CourseWebService, private route: ActivatedRoute, private router: Router) {}
}
