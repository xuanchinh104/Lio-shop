export interface AppEnvironment {
    production: boolean;
    name: string;
    storageKey: string;
    apiServer: string;
    authServer: string;
    authServerSSO: string;
    // authServerSinhVien: string;
    redirectServer: string;
    client_id_hrm: string;
    client_secret_hrm: string;
    client_id: string;
    client_secret: string;
    client_scope: string;
    redirectUrl: string;
    titleTaskbar: string;
    version: string;
    mediaServer: string;
    redirectWhenLogout: string;
    logoUrl: string;
    favicon: string;
    // authServerAzure: string;
    // tenant: string;
    // client_id_azure: string;

    urlGioiThieu: any;
    urlTaiLieu: any;
    thoiGianDay: number;

    serviceName: string;
    serviceNameRHM: string;
}
