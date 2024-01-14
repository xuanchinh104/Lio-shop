import { Injectable } from '@angular/core';
import { AppConstant } from '@asc/core/constants';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private toastr: ToastrService) {}

    /**
     * Creates notification
     * @param title
     * @param content
     */
    createNotification(title: string, content: string): void {
        this.toastr.success(content, title, {
            enableHtml: true,
        });
    }

    /**
     * Shows error message
     * @param mes
     */
    showSuccessMessage(mes: string): void {
        this.toastr.success(mes, AppConstant.TITLE, {
            enableHtml: true,
        });
    }

    /**
     * Shows error message
     * @param mes
     */
    showErrorMessage(mes: string): void {
        this.toastr.error(mes, AppConstant.TITLE, {
            enableHtml: true,
            timeOut: 100000,
        });
    }

    showWarningMessage(mes: string): void {
        this.toastr.warning(mes, AppConstant.TITLE, {
            enableHtml: true,
        });
    }
}
