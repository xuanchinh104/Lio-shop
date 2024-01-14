import { SafeAny } from './safe-type';

export type OnTouchedType = () => SafeAny;
export type OnChangeType = (_: SafeAny) => void;
