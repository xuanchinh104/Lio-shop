import { PagedResult } from '@asc/shared/data-access';
import { NhomKhoaHoc } from '..';

export interface NhomKhoaHocByPhong extends PagedResult<NhomKhoaHoc[]> {
    info: {
        id: number;
        seoAlias: string;
        tenPhongBan: string;
    };
}
