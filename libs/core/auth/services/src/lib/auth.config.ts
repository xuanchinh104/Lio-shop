export const AuthConfig = {
    USER_INFO: 'client_user_info',
    JWT_TOKEN: 'client_jwt',
    VERIFY_CODE: 'verifier_code',
    SESSION_LANG: 'sessionLang',
};

export const GRANT_TYPE = {
    AuthorizationCode: 'authorization_code',
    RefreshToken: 'refresh_token',
};

export const REDIRECT_URL_CALLBACK = (url: string): string => `${url}/sso`;
export const REDIRECT_URL_CALLBACK_HRM = (url: string): string => `${url}`;
export const REDIRECT_URL_SSO = (authServer: string, queryParams: string): string => `${authServer}/connect/authorize?${queryParams}`;
export const REDIRECT_URL_SSO_HRM = (authServer: string, queryParams: string): string => `${authServer}?${queryParams}`;
export const REDIRECT_URL_LOGOUT = (authServer: string, queryParams: string): string => `${authServer}/connect/logout?${queryParams}`;
export const REDIRECT_URL_VERIFY_SSO = window.location.origin + '/verify-sso';
export const REDIRECT_URL_AZURE = (authAzure: string, tenant: string, queryParams: string): string =>
    `${authAzure}/${tenant}/oauth2/authorize?${queryParams}`;

export const API_USER_INFO = (authServer: string): string => authServer + '/connect/userinfo';
export const API_AUTHENTICATE = (authServer: string): string => authServer + '/connect/token';
export const API_LOGOUT = (authServer: string): string => authServer + '/connect/logout';
export const API_CHANGE_PASSWORD = (authServer: string): string => authServer + '/api/v1/Users/ChangePasswordByUserId';
export const API_CHANGE_PASSWORD_USERNAME = (authServer: string): string => authServer + '/api/v1/Users/ChangePasswordByUserName';
export const API_CHANGE_PASSWORD_IDS = (authServer: string): string => authServer + '/api/v1/Users/ChangePasswordByIds';
export const API_LOCKED_USER = (authServer: string): string => authServer + '/api/v1/Users/LockUsers';
export const API_SYNC_USER = (authServer: string): string => authServer + '/api/v1/Users/CreateOrUpdate';
export const API_CREATE_USER = (authServer: string): string => authServer + '/api/v1/Users/Create';
export const API_UPDATE_USER = (authServer: string): string => authServer + '/api/v1/Users/Update';
export const API_REVOKE_TOKEN = (authServer: string): string => authServer + '/connect/revoke';

export const API_AUTHENTICATE_SSO = (authServer: string): string => authServer + '/connect/keycode';
export const API_HASH_CODE = (authServer: string): string => authServer + '/api/v1/Users/HashCode';
export const API_CREATE_USER_HRM = (authServer: string): string => authServer + '/api/v1/Users/CreateUserHrm';

export const API_USER_LOGIN = (authServer: string): string => authServer + '/connect/login';
export const API_ACCOUNT_LOGIN = (authServer: string): string => authServer + '/Account/Login';

export const API_ACCOUNT_LOGIN_MICROSOFT = (authServer: string): string => authServer + '/Account/LoginMicrosoft';

export const REDIRECT_URL_FORGOT_PASSWORD = (authServer: string): string => authServer + '/Account/RecoverPassword';
