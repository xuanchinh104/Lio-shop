import { SELECT_DIRECTIVE } from './constants';
import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Option, SelectDirective } from './types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryOption } from '@asc/shared/data-access';
import { SelectControlEnum } from '../select-control.enum';
import { AclService } from '@asc/features/system/data-access/service';
import { RbacService } from '@asc/shared/services/common';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'select-control[appACLDataSource]',
    providers: [
        {
            provide: SELECT_DIRECTIVE,
            useExisting: ACLDataSourceDirective,
        },
    ],
})
export class ACLDataSourceDirective implements OnInit, OnChanges, SelectDirective {
    @Input() type!: SelectControlEnum;
    @Input() refId!: number;
    options$: Observable<Option[]> = of([]);
    constructor(private aclService: AclService, private rbacService: RbacService) {
        // code here
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { refId } = changes;
        if (refId?.currentValue) {
            // set value
            this.refId = refId.currentValue;
            this.init();
        }
    }

    ngOnInit(): void {
        this.init();
    }

    init(): void {
        switch (this.type) {
            case SelectControlEnum.ACL_MODULE:
                // this.options$ = this.rbacService.getModules(this.queryOption).pipe(
                //     map(res =>
                //         res.map(m => ({
                //             value: m.id,
                //             label: m.tenModule,
                //         }))
                //     )
                // );
                break;
        }
    }

    get queryOption(): QueryOption {
        return {
            pageNumber: 0,
            pageSize: 0,
            isVisible: true,
            isActive: true,
        };
    }
}
