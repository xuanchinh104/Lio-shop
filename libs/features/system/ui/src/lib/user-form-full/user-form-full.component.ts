// import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
// import { CoSo, PhongBan } from '@asc/features/sdtc/data-access';
// import { ChucVu } from '@asc/features/catalog/data-access';
// import { AclService } from '@asc/features/system/data-access/service';
// import { SoDoToChucService } from '@asc/features/sdtc/service';
// import { CatalogService } from '@asc/features/catalog/service';
// import { of } from 'rxjs';
// import { switchMap, takeUntil, tap } from 'rxjs/operators';
// import { AbstractControl, Validators } from '@angular/forms';
// import { CustomEmailValidator, NumberValidator, validateAllFormFields } from '@asc/shared/utils';
// import { MessageConstant } from '@asc/core/constants';
// import { SelectControlEnum } from '@asc/shared/ui/select-control';
// import { QueryOption } from '@asc/shared/data-access';
// import { AclConstant, UserOfList } from '@asc/features/system/data-access/models';
// import { BaseSystemFormComponent } from '@asc/features/system/data-access/base';
//
// @Component({
//     selector: 'asc-user-form-full',
//     templateUrl: './user-form-full.component.html',
//     styleUrls: ['./user-form-full.component.scss'],
// })
// export class UserFormFullComponent extends BaseSystemFormComponent<UserOfList> implements OnInit, OnDestroy {
//     phongBans: PhongBan[] = [];
//     coSos: CoSo[] = [];
//     chucVus: ChucVu[] = [];
//
//     selectControlEnum = SelectControlEnum;
//
//     constructor(
//         injector: Injector,
//         private aclService: AclService,
//         private sdtcService: SoDoToChucService,
//         private catalogService: CatalogService
//     ) {
//         super(injector);
//     }
//
//     ngOnInit(): void {
//         super.ngOnInit();
//         this.initForm();
//
//         this.form
//             .get('coSo.idCoSo')
//             ?.valueChanges.pipe(
//                 switchMap(value => {
//                     if (value > 0) {
//                         const coSo = this.coSos.find(m => m.id === value);
//                         this.form.get('coSo')?.patchValue(coSo);
//                         return this.sdtcService
//                             .getPhongBans(
//                                 {
//                                     ...this.queryfetchAll,
//                                     idCoSo: value,
//                                 },
//                                 true
//                             )
//                             .pipe(tap(phongBans => (this.phongBans = phongBans)));
//                     }
//                     return of([]);
//                 }),
//                 takeUntil(this.destroyed$)
//             )
//             .subscribe();
//         //
//         this.phongBanControl.get('idPhongBan')?.valueChanges.subscribe(value => {
//             const phongBan = this.phongBans.find(m => m.id === value);
//             this.form.get('phongBan')?.patchValue(phongBan);
//         });
//
//         this.chucVuControl.get('idChucVu')?.valueChanges.subscribe(value => {
//             const chucVu = this.chucVus.find(m => m.id === value);
//             this.form.get('chucVu')?.patchValue(chucVu);
//         });
//     }
//
//     ngOnDestroy(): void {
//         super.ngOnDestroy();
//     }
//
//     initForm(): void {
//         this.form = this.formBuilder.group({
//             firstName: ['', Validators.required],
//             lastName: ['', Validators.required],
//             address: [''],
//             email: ['', CustomEmailValidator],
//             mobileNumber: ['', [NumberValidator]],
//             phoneNumber: [''],
//             userName: ['', Validators.required],
//             password: ['', Validators.required],
//             avatar: [''],
//             isActive: [true],
//             coSo: this.formBuilder.group({
//                 idCoSo: [null, Validators.required],
//                 maCoSo: [''],
//                 tenCoSo: [''],
//                 soThuTu: [null],
//             }),
//             phongBan: this.formBuilder.group({
//                 idPhongBan: [null, Validators.required],
//                 maPhongBan: [''],
//                 tenPhongBan: [''],
//                 soThuTu: [null],
//             }),
//             chucVu: this.formBuilder.group({
//                 idChucVu: [null, Validators.required],
//                 maChucVu: [''],
//                 tenChucVu: [''],
//                 soThuTu: [null],
//             }),
//         });
//     }
//
//     onSubmit(): void {
//         if (this.form.invalid) {
//             // trigger validate all field
//             validateAllFormFields(this.form);
//             return;
//         }
//
//         if (this.form.valid) {
//             this.aclService
//                 .post(AclConstant.ACL_USER + '/UserBelongToDVPBCV', this.form.value)
//                 .pipe(takeUntil(this.destroyed$))
//                 .subscribe(() => {
//                     // show notification
//                     this.notification.showSuccessMessage(MessageConstant.COMMON.MSG_CREATE_DONE);
//                     // close form
//                     this.closeForm(true);
//                 });
//         }
//     }
//
//     get coSoControl(): AbstractControl {
//         return this.form.controls['coSo'];
//     }
//
//     get chucVuControl(): AbstractControl {
//         return this.form.controls['chucVu'];
//     }
//
//     get phongBanControl(): AbstractControl {
//         return this.form.controls['phongBan'];
//     }
//
//     get queryfetchAll(): QueryOption {
//         return {
//             pageNumber: 0,
//             pageSize: 0,
//             isVisible: true,
//         };
//     }
// }
