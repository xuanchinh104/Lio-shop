export interface InitPay {
    errorCode: string;
    message: string;
    url: string;
    metaData: MetaData;
}

export interface PaymentResult {
    code: string;
    title: string;
    message: string;
    datas: PaymentResultData[];
}

export interface PaymentResultData {
    label: string;
    value: string;
    color: string;
}

export interface MetaData {
    amount: number;
    totalAmount: number;
    description: string;
    partnerCode: string;
    createDate: string;
    virtualAcctId: string;
    qrImg: string;
    hashCode: string;
    transId: string;
    period: number;
}
