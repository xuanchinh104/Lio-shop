import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CourseWebService } from '@asc/web/shell/data-access/service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdCardNumberValidator, ScriptUtil, validateAllFormFields } from '@asc/shared/utils';
import { CourseWebConstant } from '@asc/web/shell/data-access/constant';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TraCuuVangBang } from '@asc/web/shell/data-access/models';
import { PagedResult } from '@asc/shared/data-access';

@Component({
    selector: 'asc-search-certificate',
    templateUrl: './search-certificate.component.html',
    styles: [
        `
            :host::ng-deep {
                .help {
                    top: 13px;
                }

                .required-asterisk {
                    display: none;
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCertificateComponent implements OnInit {
    form!: FormGroup;

    isLoading = false;

    readonly refresh$ = new BehaviorSubject(false);
    readonly pageNumber$ = new BehaviorSubject<number>(1);
    readonly pageSize$ = new BehaviorSubject<number>(10);
    readonly trigger$ = combineLatest([this.pageSize$, this.pageNumber$, this.refresh$]).pipe(shareReplay());
    readonly request$: Observable<PagedResult<TraCuuVangBang[] | null>> = this.trigger$.pipe(
        switchMap(([pageSize, pageNumber, refresh]) => {
            if (refresh) {
                return this.getTraCuuVanBang(pageSize, pageNumber);
            }
            return of({
                items: null,
                pagingInfo: {
                    totalItems: 0,
                    pageNumber: 0,
                    pageSize: 0,
                },
            });
        }),
        shareReplay()
    );

    readonly isShowPaging$ = this.request$.pipe(
        map(rs => {
            if (rs.pagingInfo.totalItems && rs.pagingInfo.pageSize) {
                return rs.pagingInfo.totalItems / rs.pagingInfo.pageSize > 1;
            }
            return false;
        })
    );

    readonly vanBang$ = this.request$.pipe(map(x => x.items));

    readonly total$ = this.request$.pipe(map(rs => rs.pagingInfo?.totalItems ?? 0));

    constructor(private courseWebService: CourseWebService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            maHocVien: ['', Validators.required],
            hoTen: ['', Validators.required],
            soCMND: ['', [Validators.required, IdCardNumberValidator]],
        });
    }

    onSubmit(): void {
        const maHocVien = this.form.get('maHocVien')?.value;
        const hoTen = this.form.get('hoTen')?.value;

        if (!!maHocVien || !!hoTen) {
            this.form.get('maHocVien')?.clearValidators();
            this.form.get('maHocVien')?.updateValueAndValidity();
            this.form.get('hoTen')?.clearValidators();
            this.form.get('hoTen')?.updateValueAndValidity();
            if (this.form.invalid) {
                validateAllFormFields(this.form);
            } else {
                this.pageNumber$.next(1);
                ScriptUtil.setScrollTop(true);
                this.refresh$.next(true);
            }
            this.cdr.detectChanges();
        } else {
            this.form.get('maHocVien')?.setValidators([Validators.required]);
            this.form.get('maHocVien')?.updateValueAndValidity();
            this.form.get('hoTen')?.setValidators([Validators.required]);
            this.form.get('hoTen')?.updateValueAndValidity();
            if (this.form.invalid) {
                validateAllFormFields(this.form);
            } else {
                this.pageNumber$.next(1);
                ScriptUtil.setScrollTop(true);
                this.refresh$.next(true);
            }
        }
    }

    changeMaHocVien(maHocVien: string): void {
        if (maHocVien) {
            this.form.get('hoTen')?.clearValidators();
            this.form.get('hoTen')?.updateValueAndValidity();
        } else {
            this.form.get('maHocVien')?.setValidators([Validators.required]);
            this.form.get('maHocVien')?.updateValueAndValidity();
            this.form.get('hoTen')?.setValidators([Validators.required]);
            this.form.get('hoTen')?.updateValueAndValidity();
        }
    }

    changeHoTen(hoTen: string): void {
        if (hoTen) {
            this.form.get('maHocVien')?.clearValidators();
            this.form.get('maHocVien')?.updateValueAndValidity();
        } else {
            this.form.get('hoTen')?.setValidators([Validators.required]);
            this.form.get('hoTen')?.updateValueAndValidity();
            this.form.get('maHocVien')?.setValidators([Validators.required]);
            this.form.get('maHocVien')?.updateValueAndValidity();
        }
    }

    refreshView(): void {
        this.form.reset();
        this.refresh$.next(true);
    }

    onPageChanged(currentPage: number): void {
        this.pageNumber$.next(currentPage);
        ScriptUtil.setScrollTop(true);
    }

    private getTraCuuVanBang(pageSize: number, pageNumber: number): Observable<PagedResult<TraCuuVangBang[]>> {
        this.isLoading = true;
        return this.courseWebService
            .get(CourseWebConstant.KHOA_HOC_FOR_WEB + '/TraCuuVanBang', {
                ...this.form.value,
                pageSize,
                pageNumber,
                keyword: '',
                sortName: 'id',
                sortASC: false,
            })
            .pipe(
                map(res => ({
                    items: res ? res.items : null,
                    pagingInfo: res ? res.pagingInfo : {},
                })),
                finalize(() => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                })
            );
    }
}
