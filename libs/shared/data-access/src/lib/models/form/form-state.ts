import { ActionEnum } from '../../enums';

export interface FormState<T> {
    data: T | null;
    action: ActionEnum;
    titleKey?: string;
}
