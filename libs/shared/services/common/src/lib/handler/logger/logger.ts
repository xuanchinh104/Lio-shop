import { isDevMode } from '@angular/core';
import { environment } from '@asc/shared/env';

const record: Record<string, boolean> = {};

export const PREFIX = '[ASC]:';

function notRecorded(...args: any[]): boolean {
    const asRecord = args.reduce((acc, c) => acc + c.toString(), '');

    if (record[asRecord]) {
        return false;
    } else {
        record[asRecord] = true;
        return true;
    }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function consoleCommonBehavior(consoleFunc: (...args: any) => void, ...args: any[]): void {
    if (environment.production || (isDevMode() && notRecorded(...args))) {
        consoleFunc(...args);
    }
}

// Warning should only be printed in dev mode and only once.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const warn = (...args: any[]) => consoleCommonBehavior((...arg: any[]) => console.warn(PREFIX, ...arg), ...args);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const warnDeprecation = (...args: any[]) => {
    if (!environment.production) {
        const stack = new Error().stack;
        return consoleCommonBehavior((...arg: any[]) => console.warn(PREFIX, 'deprecated:', ...arg, stack), ...args);
    } else {
        return () => {
            // code here
        };
    }
};

// Log should only be printed in dev mode.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const logDev = (...args: any[]) => {
    if (isDevMode()) {
        console.warn(PREFIX, ...args);
    }
};
