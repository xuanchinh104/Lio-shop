export interface GenericSelectOption<T> {
    id: number;
    text: string;
    item?: T | null;
}
