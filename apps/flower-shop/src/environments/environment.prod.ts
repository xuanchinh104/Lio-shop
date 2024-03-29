const PROD = (window as any)['env_prod'];
export const environment = {
    production: true,
    name: 'production',
    storageKey: 'dtnh',
    apiServer: PROD.apiServer,
    authServer: PROD.authServer,
    authServerSSO: PROD.authServerSSO,
    // authServerSinhVien: PROD.authServerSinhVien,
    redirectServer: PROD.redirectServer,
    client_id_hrm: PROD.client_id_hrm,
    client_secret_hrm: PROD.client_secret_hrm,
    client_id: PROD.client_id,
    client_secret: PROD.client_secret,
    client_scope: PROD.client_scope,
    redirectUrl: PROD.redirectUrl,
    titleTaskbar: PROD.titleTaskbar,
    version: PROD.version,
    mediaServer: PROD.mediaServer,
    redirectWhenLogout: PROD.redirectWhenLogout,
    logoUrl: PROD.logoUrl,
    favicon: PROD.favicon,
    // authServerAzure: PROD.authServerAzure,
    // tenant: PROD.tenant,
    // client_id_azure: PROD.client_id_azure,

    urlGioiThieu: PROD.urlGioiThieu,
    urlTaiLieu: PROD.urlTaiLieu,
    thoiGianDay: PROD.thoiGianDay,

    serviceName: PROD.serviceName,
    serviceNameRHM: PROD.serviceNameRHM,
};
