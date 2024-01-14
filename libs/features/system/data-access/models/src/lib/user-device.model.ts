export interface UserDevice {
    type: string;
    osName: string;
    osVersion: string;
    engineName: string;
    engineVersion: string;
    browserName: string;
    browserVersion: string;
    ipAddress: string;
    cityName: string;
    countryName: string;
    countryIsoCode: string;
    timeZone: string;
    postalCode: string;
    userAgent: string;
    deviceHash: string;
    loggedTime: number;
    logoutTime: number;
    sessionCode: string;
}
