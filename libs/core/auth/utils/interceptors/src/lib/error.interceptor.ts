import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SafeAny } from '@asc/shared/utils';
import { NotificationService } from '@asc/shared/services/common';
import { MessageConstant, UrlConstant } from '@asc/core/constants';
import { AuthService } from '@asc/core/auth/services';
import { ErrorMessage, ResponseData } from '@asc/shared/data-access';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private isRunBackground = 'background';

    constructor(
        private auth: AuthService,
        private notification: NotificationService,
        private router: Router,
        private modalService: NzModalService,
        @Inject(APP_ENVIRONMENT) protected env: AppEnvironment
    ) {}

    intercept(req: HttpRequest<SafeAny>, next: HttpHandler): Observable<HttpEvent<SafeAny>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error instanceof ProgressEvent) {
                    if (this.isRunBackgroundFn(req)) {
                        this.notification.showErrorMessage(MessageConstant.COMMON.MSG_SERVER_DISCONNECT);
                    }
                } else if (error.error instanceof ErrorEvent) {
                    this.notification.showErrorMessage(MessageConstant.COMMON.MSG_INTERNET_REFUSE);
                } else {
                    const statusCode = error.status;
                    const params = req.url.split('/');
                    switch (statusCode) {
                        case 401:
                            // 401 handled in auth.interceptor
                            if (
                                (params.includes('Accounts') && params.includes('Refresh-Token')) ||
                                (params.includes('Accounts') && params.includes('Logout'))
                            ) {
                                this.auth.doBackLogin();
                            }
                            break;
                        case 403:
                            this.modalService.closeAll();
                            // 403 handled in auth.interceptor
                            this.modalService.warning({
                                nzTitle: 'Thông báo',
                                nzContent: 'Bạn không có quyền truy cập vào chức năng này !',
                                nzOkText: 'Đồng ý',
                            });
                            void this.router.navigate([UrlConstant.ROUTE.FORBIDEN]);
                            break;
                        case 404:
                            // this.notification.showErrorMessage(error.statusText);
                            break;
                        case 500:
                            if (
                                (params.includes('Accounts') && params.includes('Refresh-Token')) ||
                                (params.includes('Accounts') && params.includes('Logout'))
                            ) {
                                this.auth.doBackLogin();
                            } else {
                                if (this.isRunBackgroundFn(req)) {
                                    this.notification.showErrorMessage(MessageConstant.COMMON.MSG_ERROR_SYSTEM);
                                }
                            }

                            break;
                        case 503:
                            if (this.isRunBackgroundFn(req)) {
                                this.notification.showErrorMessage(MessageConstant.COMMON.MSG_ERROR_SYSTEM);
                            }
                            break;
                        default:
                            if (statusCode !== 200 && req.url.endsWith('/connect/token')) {
                                this.modalService.closeAll();
                                this.modalService.warning({
                                    nzTitle: 'Thông báo',
                                    nzContent: 'Phiên đăng nhập của bạn đã hết, vui lòng đăng nhập lại !',
                                    nzOkText: 'Đồng ý',
                                    nzMaskClosable: false,
                                    nzClosable: false,
                                    nzOnOk: () => {
                                        this.auth.clearUserInfo$.next(true);
                                        this.auth.doBackLogin();
                                    }
                                  });
                            } else {
                                if (error.error) {
                                    const serverError = error.error as ResponseData<unknown>;
                                    if (error.error?.traceId) {
                                        if (this.isRunBackgroundFn(req)) {
                                            this.notification.showErrorMessage(MessageConstant.COMMON.MSG_FORMAT_INVALID);
                                        }
                                    } else {
                                        if (serverError.errorMessages) {
                                            const messages = serverError.errorMessages
                                                .map((err: ErrorMessage) =>
                                                    // return this.getMessage(x.errorCode);
                                                    this.getMessageToJson(err.errorCode, err.errorMessage)
                                                )
                                                .join('<br/>');
                                            this.notification.showErrorMessage(messages);
                                        }
                                    }
                                } else {
                                    this.notification.showErrorMessage(error.error.error.message);
                                }
                            }
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }

    getMessageToJson(key: string, mes: string): string {
        try {
            return mes;
        } catch (e) {
            return mes;
        }
    }

    private isRunBackgroundFn(req: HttpRequest<SafeAny>): boolean {
        return !req.headers.get(this.isRunBackground) || req.headers.get(this.isRunBackground) !== 'true';
    }
}
