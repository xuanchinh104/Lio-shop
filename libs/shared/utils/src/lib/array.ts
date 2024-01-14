import { SafeAny } from './types/safe-type';

export function groupArrayOfObjects(list: SafeAny, key: SafeAny): SafeAny {
    return list.reduce(function (rv: SafeAny, x: SafeAny) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}
