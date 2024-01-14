export interface ConfigMail {
    id: number;
    mailKey: string;
    mailAddress: string;
    mailPassword: string;
    smtpHost: string;
    port: number;
    isEnableSSL: boolean;
    smtpUser: string;
    smtpPass: string;
    isVisible: boolean;
}

export interface ConfigMailAzure {
    id: number;
    mailKey: string;
    email: string;
    secretId: string;
    objectId: string;
    displayName: string;
    description: string;
    expries: string;
    isVisible: boolean;
    creationDate: string;
}

export interface Config {
    id: number;
    key: string;
    tieuDe: string;
    kieuDuLieu: number;
    isHienThi: boolean;
}

export interface ConfigMailSelect {
    id: number;
    mailKey: string;
    mailAddress: string;
}
