import { AuthConfig } from './auth.config';
import { JwtToken, TokenInfo } from '@asc/core/auth/data-access';
import { Injectable } from '@angular/core';
import { StorageService } from '@asc/shared/services/storage';

@Injectable({ providedIn: 'root' })
export class JwtService {
    constructor(private storage: StorageService) {}

    setUserToken(jwt: JwtToken): void {
        this.storage.store<JwtToken>(AuthConfig.JWT_TOKEN, jwt);
    }

    removeToken(): void {
        this.storage.clear(AuthConfig.JWT_TOKEN);
    }

    /**
     * Gets refresh token
     * @returns
     */
    getRefreshToken(): string | null {
        const tokenInfo = this.getTokenInfo();
        if (!tokenInfo) {
            return null;
        }
        return tokenInfo.refresh_token;
    }

    /**
     * Gets access token
     * @returns
     */
    getAccessToken(): string | null {
        const tokenInfo = this.getTokenInfo();
        if (!tokenInfo) {
            return null;
        }
        return tokenInfo.access_token;
    }

    getTokenInfo(): JwtToken | null {
        const token = this.storage.retrieve<JwtToken>(AuthConfig.JWT_TOKEN);
        if (!token) {
            return null;
        }
        return token;
    }

    getIdToken(): string | null {
        const tokenInfo = this.getTokenInfo();
        if (!tokenInfo) {
            return null;
        }
        return tokenInfo.id_token;
    }

    decodeToken(): TokenInfo | null {
        try {
            const idToken = this.getIdToken();
            if (idToken) {
                const base64Url = idToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        })
                        .join('')
                );

                return JSON.parse(jsonPayload);
            }
        } catch (ex) {
            return null;
        }

        return null;
    }

    getUserId(): string | null {
        const tokenInfo = this.decodeToken();
        if (!tokenInfo) {
            return null;
        }

        return tokenInfo.sub;
    }

    isTokenExpired(): boolean {
        const token = this.getTokenInfo()?.id_token;
        if (!token) {
            return true;
        }
        const decode = this.decodeToken();
        if (!decode) {
            return true;
        }

        const expiry = decode?.exp;
        return Math.floor(new Date().getTime() / 1000) >= expiry;
    }
}
