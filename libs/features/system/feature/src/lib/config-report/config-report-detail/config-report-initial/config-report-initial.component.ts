import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ConfigReportDetail, ExcelAlignDescription } from '@asc/features/system/data-access/models';

@Component({
    selector: 'asc-config-report-initial',
    templateUrl: './config-report-initial.component.html',
    styleUrls: ['./config-report-initial.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigReportInitialComponent {
    @Input() isLoadingBackup = false;
    configReportDetails: ConfigReportDetail[] = [];
    excelAlignDescription = ExcelAlignDescription;

    @Input() set configReportBackup(val: ConfigReportDetail[]) {
        if (val && val.length > 0) {
            this.configReportDetails = val;
            this.cdr.detectChanges();
        }
    }

    constructor(private cdr: ChangeDetectorRef) {}
}
