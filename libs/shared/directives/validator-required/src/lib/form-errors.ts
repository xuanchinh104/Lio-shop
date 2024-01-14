import { InjectionToken } from '@angular/core';

type SafeAny = any;

export const defaultErrors = {
    required: () => 'Vui lòng không được bỏ trống',
    minlength: (field: SafeAny) => `Bắt buộc nhập tối thiểu ${field.requiredLength} kí tự`,
    maxlength: (field: SafeAny) => `Bắt buộc nhập tối đa ${field.requiredLength} kí tự`,
    email: () => 'Định dạng Email không chính xác',
    invalidNumber: () => 'Bắt buộc phải nhập số',
    invalidSpace: () => 'Nội dung không được có khoảng trắng',
    invalidPhoneNumber: () => 'Định dạng số điện thoại không chính xác',
    mustMatch: () => 'Xác nhận mật khẩu không khớp',
    invalidIdCardNumber: () => 'Số CMND/CCCD/Hộ chiếu là 8 hoặc 9 hoặc 12 kí tự',
    invalidIdCardNumberSpecialWord: () => 'Số CMND/CCCD/Hộ chiếu có chứa ký tự đặc biệt',
    invalidNoAccent: () => 'Nội dung không được có dấu',
    invalidSpecialWord: () => 'Nội dung chứa ký tự đặc biệt',
    invalidTaxCode: () => 'Mã số thuế không đúng định dạng',
    invalidLimitText: () => 'Nội dung không được phép vượt quá 500 kí tự',
    maxLengthKhoaHoc: () => 'Mã khóa học không vượt quá 50 ký tự',
    maxLengthNhomKhoaHoc: () => 'Mã nhóm khóa học không vượt quá 50 ký tự',
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
    providedIn: 'root',
    factory: () => defaultErrors,
});
