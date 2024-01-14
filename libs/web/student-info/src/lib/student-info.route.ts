import { RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CourseRegisteredComponent } from './course-registered/course-registered.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { StudentInfoComponent } from './student-info.component';
import { StudentUpdateComponent } from './student-update/student-update.component';

export const StudentInfoRoute = RouterModule.forChild([
    {
        path: '',
        component: StudentInfoComponent,
        children: [
            {
                path: 'info',
                component: StudentUpdateComponent,
            },
            {
                path: 'receipt',
                component: ReceiptListComponent,
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
            },
            {
                path: 'course-registered',
                component: CourseRegisteredComponent,
            },
        ],
    },
]);
