import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SafeAny } from './types';

export function UrlValidator(control: AbstractControl): ValidationErrors | null {
    if (control.pristine) {
        return null;
    }
    // eslint-disable-next-line max-len
    const URL_REGEXP =
        // eslint-disable-next-line max-len
        /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    control.markAsTouched();
    if (URL_REGEXP.test(control.value)) {
        return null;
    }
    return {
        invalidUrl: true,
    };
}

export function PhoneNumberValidator(control: AbstractControl): { [key: string]: SafeAny } | null {
    if (control.value === '' || control.value == null) {
        return null;
    }

    // vd dang sdt hop le
    // 0792767841
    // +84792767841
    const URL_REGEXP = /^\+?[0-9]{10,11}$/;
    if (URL_REGEXP.test(control.value)) {
        return null;
    }
    return {
        invalidPhoneNumber: {
            valid: false,
            value: control.value,
        },
    };
}

// check số CMND/CCCD
export function IdCardNumberValidator(control: AbstractControl): ValidationErrors | null {
    const noAccent = /^[a-zA-Z0-9]*[a-zA-z0-9]$/;
    const specialWord = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (control.pristine) {
        return null;
    }

    if (control.value === '' || control.value == null) {
        return null;
    }

    if (![8, 9, 12].includes(control.value.length)) {
        return {
            invalidIdCardNumber: true,
        };
    }

    if (specialWord.test(control.value)) {
        return {
            invalidIdCardNumberSpecialWord: true,
        };
    }

    if (control.value && !noAccent.test(control.value)) {
        return {
            invalidNoAccent: true,
        };
    }

    return null;
}

// check co chua ky tu space trong chuoi
export function SpaceValidator(control: AbstractControl): { [key: string]: SafeAny } | null {
    if (control.value === '' || control.value == null) {
        return null;
    }
    const SPACE_REGEXP = /\s/;
    if (SPACE_REGEXP.test(control.value)) {
        return {
            invalidSpace: true,
        };
    }
    return null;
}

export function NumberValidator(control: AbstractControl): ValidationErrors | null {
    if (control.pristine) {
        return null;
    }
    const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
    // control.markAsTouched();

    if (control.value === '' || control.value == null) {
        return null;
    }

    if (NUMBER_REGEXP.test(control.value)) {
        return null;
    }

    return {
        invalidNumber: true,
    };
}

// check ký tự có dấu và ký tự đặc biệt
export function CodeValidator(control: AbstractControl): ValidationErrors | null {
    const noAccent = /^[a-zA-Z0-9]*[a-zA-z0-9]$/;
    const specialWord = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (specialWord.test(control.value)) {
        return {
            invalidSpecialWord: true,
        };
    }

    if (control.value && !noAccent.test(control.value)) {
        return {
            invalidNoAccent: true,
        };
    }

    return null;
}

// check ký tự có dấu và ký tự đặc biệt ( được phép nhập dấu "." và dấu "_" )
export function SpecialCodeValidator(control: AbstractControl): ValidationErrors | null {
    const allowedCharacters = /^[\s\S]*$/;
    const specialWord = /[ `!@#$%^&*()+\-=[\]{};':"\\|,<>/?~]/;

    if (specialWord.test(control.value)) {
        return {
            invalidSpecialWord: true,
        };
    }

    if (control.value && !allowedCharacters.test(control.value)) {
        return {
            invalidAllowedCharacters: true,
        };
    }

    return null;
}

// check hơn 500 ký tự

export function LimitLengthValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value == null) {
        return null;
    }
    if (control.value.length > 500) {
        return {
            invalidLimitText: true,
        };
    }

    return null;
}

// check giới hạn mã khóa học

export function MaxLengthKhoaHocValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value == null) {
        return null;
    }
    if (control.value.length > 50) {
        return {
            maxLengthKhoaHoc: true,
        };
    }
    return null;
}

// check giới hạn mã nhóm khóa học

export function MaxLengthNhomKhoaHocValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value == null) {
        return null;
    }
    if (control.value.length > 50) {
        return {
            maxLengthNhomKhoaHoc: true,
        };
    }
    return null;
} // check giới hạn 500 ký tự

// check mã số thuế
export function TaxCodeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
        return null;
    }
    const taxCodeRegex = /^[0-9-]+$/;

    const isValid = taxCodeRegex.test(control.value);

    return isValid ? null : { invalidTaxCode: true };
}

export function CustomEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
        return null;
    }
    return Validators.email(control);
}

export function ComparePasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export function day(): ValidatorFn {
    const minV = 1;
    const maxV = 31;

    return (c: AbstractControl): { [key: string]: SafeAny } | null => {
        const value = parseInt(c.value, 10) || false;
        const isValid = value >= minV && value <= maxV && value;

        return !isValid ? { isInvalidDay: true } : null;
    };
}

export function month(): ValidatorFn {
    const minV = 1;
    const maxV = 12;

    return (c: AbstractControl): { [key: string]: SafeAny } | null => {
        const value = parseInt(c.value, 10);
        const isValid = value >= minV && value <= maxV && value;

        return !isValid ? { isInvalidMonth: true } : null;
    };
}

export function year(): ValidatorFn {
    const maxV = new Date().getFullYear() - 18;
    const minV = maxV - 80;

    return (c: AbstractControl): { [key: string]: SafeAny } | null => {
        const value = parseInt(c.value, 10);
        const isValid = value >= minV && value <= maxV && value;

        return !isValid ? { isInvalidYear: true } : null;
    };
}

export function isNotNull<T>(value: T): value is NonNullable<T> {
    return value != null;
}

export function matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.parent && reverse) {
            const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
            if (c) {
                c.updateValueAndValidity();
            }
            return null;
        }
        return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value
            ? null
            : { matching: true };
    };
}
