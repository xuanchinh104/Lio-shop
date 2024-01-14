import { KhoaHoc } from './lop-hoc-register.model';

export interface NhomKhoaHoc {
    id: number;
    alias: string;
    tenNhom: string;
    ghiChu: string;
    soThuTu: number;
    khoaHocs: KhoaHoc[];
    isActive: boolean;

    hinhDaiDien: string;
    seoTitle: string;
    seoMetaKey: string;
    seoMetaDesc: string;
}
