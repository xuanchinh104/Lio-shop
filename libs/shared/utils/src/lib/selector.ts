import { GenericState } from '@asc/shared/data-access';

export class SelectorUtil {
    static isLoading({ status }: GenericState<unknown>): boolean {
        return status === 'loading';
    }

    static isDone({ status }: GenericState<unknown>): boolean {
        return status === 'success' || status === 'error';
    }
}
