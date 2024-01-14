import { ThongTinMienGiam } from './thong-tin-mien-giam.model';

export interface MapData {
    idDoiTuong: number;
    children: ThongTinMienGiam[];
}

export interface MapDataCombo {
    keyId: number;
    children: MapData[];
}
