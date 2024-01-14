import { Injectable } from '@angular/core';
import { StorageKeyManager } from './storage.util';

@Injectable({ providedIn: 'root' })
export class StorageService {
    store<T>(key: string, value: T): void {
        localStorage.setItem(StorageKeyManager.normalize(key), JSON.stringify(value));
    }

    retrieve<T>(key: string): T | null {
        const record = localStorage.getItem(StorageKeyManager.normalize(key));
        if (!record) {
            return null;
        }

        return JSON.parse(record) as T;
    }

    clear(key?: string): void {
        return key !== undefined ? localStorage.removeItem(StorageKeyManager.normalize(key)) : localStorage.clear();
    }
}
