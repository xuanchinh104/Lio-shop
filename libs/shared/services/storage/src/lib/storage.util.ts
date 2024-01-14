import { StorageConfig } from './storage.config';

export const DefaultPrefix = 'dtnh';
export const DefaultSeparator = '|';
export const DefaultIsCaseSensitive = false;

export class StorageKeyManager {
    static prefix = DefaultPrefix;
    static separator = DefaultSeparator;
    static isCaseSensitive = DefaultIsCaseSensitive;

    static normalize(raw: string): string {
        raw = StorageKeyManager.isCaseSensitive ? raw : raw.toLowerCase();
        return `${StorageKeyManager.prefix}${StorageKeyManager.separator}${raw}`;
    }

    static isNormalizedKey(key: string): boolean {
        return key.indexOf(StorageKeyManager.prefix + StorageKeyManager.separator) === 0;
    }

    static setPrefix(prefix: string): void {
        StorageKeyManager.prefix = prefix;
    }

    static setSeparator(separator: string): void {
        StorageKeyManager.separator = separator;
    }

    static setCaseSensitive(enable: boolean): void {
        StorageKeyManager.isCaseSensitive = enable;
    }

    static consumeConfiguration(config: StorageConfig): void {
        if ('prefix' in config) {
            this.setPrefix(config.prefix);
        }
        if ('separator' in config) {
            this.setSeparator(config.separator);
        }
        if ('caseSensitive' in config) {
            // this.setCaseSensitive(config.caseSensitive);
        }
    }
}
