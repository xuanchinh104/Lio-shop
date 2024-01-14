export interface Column {
    title: string;
    width: number;
    field: string;
    isChecked?: boolean;
    sortable?: boolean;
    isLocked?: boolean;
    headerStyle?: string;
    classField?: string;
    type?: string;

    headerWidth?: string;
}
