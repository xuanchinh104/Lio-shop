import { PagedResult } from '@asc/shared/data-access';
import { LopHoc } from '..';

export interface LopHocInGroupPageResult extends PagedResult<LopHoc[]> {
    info: {
        id: number;
        title: string;
        alias: string;
        seoTitle: string;
        seoMetaKey: string;
        seoMetaDesc: string;
    };
    infoKhoa: {
        id: number;
        tenKhoaHoc: string;
        alias: string;
        seoTitle: string;
        seoMetaKey: string;
        seoMetaDesc: string;
        tieuDe: string;
        moTa: string;
        noiDung: string;
        tenPhongBan: string;
        aliasPhong: string;
        aliasNhom: string;
        tenNhom: string;
    };
}
