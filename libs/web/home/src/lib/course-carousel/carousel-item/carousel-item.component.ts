import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PhongBan } from '@asc/features/catalog/data-access';
import { NhomKhoaHoc } from '@asc/web/shell/data-access/models';

@Component({
    selector: 'asc-carousel-item',
    templateUrl: './carousel-item.component.html',
    styleUrls: ['./carousel-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselItemComponent {
    @Input() item!: PhongBan;

    @Input() nhomKhoaHoc!: NhomKhoaHoc;
}
