import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ConvertData, HocVien, MapData, MapDataCombo, ThongTinMienGiam } from '@asc/web/shell/data-access/models';
import { LoaiDoiTuongDescription } from '@asc/shared/data-access';

@Component({
    selector: 'asc-course-exemptions-login',
    templateUrl: './course-exemptions-login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseExemptionsLoginComponent {
    @Output() itemLopHocDon = new EventEmitter<ThongTinMienGiam>();
    @Output() itemLopHocCombo = new EventEmitter<MapData>();
    @Output() itemLopHocComboAddCart = new EventEmitter<MapData>();
    @Input() info!: HocVien;
    @Input() courses: ConvertData[] = [];
    @Input() arrCombo: MapDataCombo[] = [];

    loaiDoiTuong = LoaiDoiTuongDescription;

    registerLopHocDon(item: ThongTinMienGiam): void {
        this.itemLopHocDon.emit(item);
    }

    registerLopHocComBo(item: MapData): void {
        this.itemLopHocCombo.emit(item);
    }

    addToCart(item: MapData): void {
        this.itemLopHocComboAddCart.emit(item);
    }
}
