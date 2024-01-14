import { Inject, Injectable, Injector } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment } from '@asc/shared/app-config';
import { Observable } from 'rxjs';
import {
    HinhThucThanhToan,
    LopHocRegistered,
    Receipt,
    ReceiptDetail,
    ReceiptRequest,
    InitPay,
    PaymentResult,
} from '@asc/web/shell/data-access/models';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { BaseWebService } from './common/base-web.service';
import { PaymentInitRequest } from '@asc/web/shell/data-access/models';

@Injectable({
    providedIn: 'root',
})
export class PaymentService extends BaseWebService {
    constructor(injector: Injector, @Inject(APP_ENVIRONMENT) protected env: AppEnvironment) {
        super(injector, env);
    }

    getReceipts(): Observable<Receipt[]> {
        return this.post(CourseWebConstant.PAYMENT_FOR_WEB + `/PhieuThuTrucTuyen`, {});
    }

    getReceiptDetail(request: ReceiptRequest): Observable<ReceiptDetail[]> {
        return this.post(CourseWebConstant.PAYMENT_FOR_WEB + `/PhieuThuTrucTuyenChiTiet`, request);
    }

    getMyCoursePayment(idTaiKhoanThanhToan?: number | null): Observable<LopHocRegistered[]> {
        return this.post(CourseWebConstant.PAYMENT_FOR_WEB + `/MyCoursePayment`, {
            idTaiKhoanThanhToan,
        });
    }

    deleteCoursePayment(req: unknown): Observable<unknown> {
        return this.delete(CourseWebConstant.PAYMENT_FOR_WEB + `/DeleteCourse`, req);
    }

    getPaymentTypes(idTaiKhoanThanhToan?: number): Observable<HinhThucThanhToan[]> {
        return this.post(CourseWebConstant.PAYMENT_FOR_WEB + '/Banks', {
            idTaiKhoanThanhToan,
        });
    }

    initPayment(request: PaymentInitRequest): Observable<InitPay> {
        return this.post(CourseWebConstant.PAYMENT_FOR_WEB + '/InitPay', request);
    }

    getResultPay(transId: string): Observable<PaymentResult> {
        return this.get(CourseWebConstant.PAYMENT_FOR_WEB + '/ResultPay', {
            transId,
        });
    }
}
