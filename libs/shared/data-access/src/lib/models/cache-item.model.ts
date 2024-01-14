import { SafeAny } from '@asc/shared/utils';

export interface ICacheItem {
    url: string;
    data: SafeAny;
}

export interface ICacheRequest {
    url: string;
    isCache: boolean;
}

export class CacheItem {
    url: string;
    data: SafeAny;

    constructor() {
        this.url = '';
    }
}
