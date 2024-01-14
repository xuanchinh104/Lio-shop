import { SafeAny } from './types';

export class ObjectUtil {
    static convertValueObjecArrayToString(object: SafeAny, prefix: string): SafeAny {
        Object.keys(object).map(function (key) {
            if (key.startsWith(prefix)) {
                object[key] = object[key] ? object[key].join(',') : null;
            }
        });
        return {
            ...object,
        };
    }

    static isObject(val: SafeAny): boolean {
        if (val === null) {
            return false;
        }
        return typeof val === 'function' || typeof val === 'object';
    }

    /**
     * Check empty object
     */
    static isNullOrEmpty(obj: SafeAny): boolean {
        if (obj) {
            for (const key in obj) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }
        }
        return true;
    }

    static isUndefined(data: SafeAny): boolean {
        return data === undefined;
    }

    static transform(data: SafeAny): SafeAny {
        return JSON.parse(JSON.stringify(data));
    }

    static mapObjectToQuery(data: Object): string {
        return Object.keys(data).filter(key => (data as any)[key]).map(key => `${key}=${(data as any)[key]}`).join('&');
    }
}
