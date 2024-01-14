import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TokenInfo } from '@asc/core/auth/data-access';
import { AuthService } from '@asc/core/auth/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

export interface InetData {
    name: string;
    data: {
        category: string;
        value: number;
        color: string;
    }[];
}

@Component({
    selector: 'asc-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
    readonly userInfo$: Observable<TokenInfo | null> = this.authService.getUserInfo().pipe(
        map(userInfo => {
            if (!userInfo?.firstname && !userInfo?.lastname) {
                const fetchUserInfo = this.authService.userinfoSSO;
                if (fetchUserInfo) {
                    return {
                        ...userInfo,
                        firstname: fetchUserInfo.first_name,
                        lastname: fetchUserInfo.last_name,
                    } as TokenInfo;
                }
            }

            return userInfo;
        })
    );
    internetGrowthData: InetData[] = [
        {
            name: '2011',
            data: [
                {
                    category: 'Asia',
                    value: 30.8,
                    color: '#9de219',
                },
                {
                    category: 'Europe',
                    value: 21.1,
                    color: '#90cc38',
                },
                {
                    category: 'Latin America',
                    value: 16.3,
                    color: '#068c35',
                },
                {
                    category: 'Africa',
                    value: 17.6,
                    color: '#006634',
                },
                {
                    category: 'Middle East',
                    value: 9.2,
                    color: '#004d38',
                },
                {
                    category: 'North America',
                    value: 4.6,
                    color: '#033939',
                },
            ],
        },
    ];

    months: string[] = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];
    count: number[] = [12, 30, 30, 45, 10, 50, 60, 55, 70, 99, 11, 55];
    count1: number[] = [15, 35, 15, 10, 20, 20, 100, 11, 50, 60, 65, 70];
    count2: number[] = [69, 40, 15, 30, 20, 70, 60, 40, 20, 50, 40, 80];
    form = this.fb.group({
        donVi: [null],
        loaiThongKe: [null],
        hienThi: [null],
        soLuong: [1],
    });
    visible = false;
    visible1 = false;
    visible2 = false;
    visible3 = false;

    constructor(private authService: AuthService, private fb: FormBuilder) {}

    closeForm(): void {
        this.visible = false;
    }

    closeForm1(): void {
        this.visible1 = false;
    }

    closeForm2(): void {
        this.visible2 = false;
    }

    closeForm3(): void {
        this.visible3 = false;
    }

    onSubmit(): void {
        // Code here
    }

    change(e: boolean): void {
        // Code here
    }

    change1(e: boolean): void {
        // Code here
    }

    change2(e: boolean): void {
        // Code here
    }

    change3(e: boolean): void {
        // Code here
    }
}
