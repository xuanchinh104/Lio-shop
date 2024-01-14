import { InputService } from './input.service';
import { SafeAny } from '@asc/shared/utils';

export class InputHandler {
    private inputService: InputService;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private onModelChange?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private onModelTouched?: Function;
    private htmlInputElement: HTMLInputElement;

    constructor(htmlInputElement: HTMLInputElement, options: SafeAny) {
        this.inputService = new InputService(htmlInputElement, options);
        this.htmlInputElement = htmlInputElement;
    }

    handleClick(event: SafeAny, chromeAndroid: boolean): void {
        const selectionRangeLength = Math.abs(
            this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart
        );

        // if there is no selection and the value is not null,
        // the cursor position will be fixed. if the browser is chrome on android, the cursor will go to the end of the number.
        if (selectionRangeLength === 0 && !isNaN(this.inputService.value)) {
            this.inputService.fixCursorPosition(chromeAndroid);
        }
    }

    handleCut(event: SafeAny): void {
        if (this.isReadOnly()) {
            return;
        }

        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            if (this.onModelChange) {
                this.onModelChange(this.inputService.value);
            }
        }, 0);
    }

    handleInput(event: SafeAny): void {
        if (this.isReadOnly()) {
            return;
        }

        const keyCode = this.getNewKeyCode(this.inputService.storedRawValue, this.inputService.rawValue);
        const rawValueLength = this.inputService.rawValue.length;
        const rawValueSelectionEnd = this.inputService.inputSelection.selectionEnd;
        const rawValueWithoutSuffixEndPosition = this.inputService.getRawValueWithoutSuffixEndPosition();
        const storedRawValueLength = this.inputService.storedRawValue.length;
        this.inputService.rawValue = this.inputService.storedRawValue;

        if (
            (rawValueSelectionEnd !== rawValueWithoutSuffixEndPosition || Math.abs(rawValueLength - storedRawValueLength) !== 1) &&
            storedRawValueLength !== 0
        ) {
            this.setCursorPosition(event);
            return;
        }

        if (rawValueLength < storedRawValueLength) {
            if (this.inputService.value !== 0) {
                this.inputService.removeNumber(8);
            } else {
                this.setValue(null);
            }
        }

        if (rawValueLength > storedRawValueLength) {
            switch (keyCode) {
                case 43:
                    this.inputService.changeToPositive();
                    break;
                case 45:
                    this.inputService.changeToNegative();
                    break;
                default:
                    if (
                        !this.inputService.canInputMoreNumbers ||
                        (isNaN(this.inputService.value) && String.fromCharCode(<number>keyCode).match(/\d/) == null)
                    ) {
                        return;
                    }

                    this.inputService.addNumber(keyCode);
            }
        }

        this.setCursorPosition(event);
        if (this.onModelChange) {
            this.onModelChange(this.inputService.value);
        }
    }

    handleKeydown(event: any): void {
        if (this.isReadOnly()) {
            return;
        }

        const keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode === 8 || keyCode === 46 || keyCode === 63272) {
            event.preventDefault();
            const selectionRangeLength = Math.abs(
                this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart
            );

            if (selectionRangeLength === this.inputService.rawValue.length || this.inputService.value === 0) {
                this.setValue(null);
                if (this.onModelChange) {
                    this.onModelChange(this.inputService.value);
                }
            }

            if (selectionRangeLength === 0 && !isNaN(this.inputService.value)) {
                this.inputService.removeNumber(keyCode);
                if (this.onModelChange) {
                    this.onModelChange(this.inputService.value);
                }
            }

            if ((keyCode === 8 || keyCode === 46) && selectionRangeLength !== 0 && !isNaN(this.inputService.value)) {
                this.inputService.removeNumber(keyCode);
                if (this.onModelChange) {
                    this.onModelChange(this.inputService.value);
                }
            }
        }
    }

    handleKeypress(event: SafeAny): void {
        if (this.isReadOnly()) {
            return;
        }

        const keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode === undefined || [9, 13].indexOf(keyCode) !== -1 || this.isArrowEndHomeKeyInFirefox(event)) {
            return;
        }

        switch (keyCode) {
            case 43:
                this.inputService.changeToPositive();
                break;
            case 45:
                this.inputService.changeToNegative();
                break;
            default:
                if (
                    this.inputService.canInputMoreNumbers &&
                    (!isNaN(this.inputService.value) || String.fromCharCode(keyCode).match(/\d/) != null)
                ) {
                    this.inputService.addNumber(keyCode);
                }
        }

        event.preventDefault();
        if (this.onModelChange) {
            this.onModelChange(this.inputService.value);
        }
    }

    handleKeyup(event: SafeAny): void {
        this.inputService.fixCursorPosition();
    }

    handlePaste(event: SafeAny): void {
        if (this.isReadOnly()) {
            return;
        }

        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            if (this.onModelChange) {
                this.onModelChange(this.inputService.value);
            }
        }, 1);
    }

    updateOptions(options: SafeAny): void {
        this.inputService.updateOptions(options);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getOnModelChange(): Function {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return <Function>this.onModelChange;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    setOnModelChange(callbackFunction: Function): void {
        this.onModelChange = callbackFunction;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getOnModelTouched(): Function {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return <Function>this.onModelTouched;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    setOnModelTouched(callbackFunction: Function): void {
        this.onModelTouched = callbackFunction;
    }

    setValue(value?: number | null): void {
        if (value) {
            this.inputService.value = value;
        }
    }

    private getNewKeyCode(oldString: string, newString: string): number | null {
        if (oldString.length > newString.length) {
            return null;
        }

        for (let x = 0; x < newString.length; x++) {
            if (oldString.length === x || oldString[x] !== newString[x]) {
                return newString.charCodeAt(x);
            }
        }

        return null;
    }

    private isArrowEndHomeKeyInFirefox(event: SafeAny): boolean {
        return [35, 36, 37, 38, 39, 40].indexOf(event.keyCode) !== -1 && (event.charCode === undefined || event.charCode === 0);
    }

    private isReadOnly(): boolean {
        return this.htmlInputElement?.readOnly;
    }

    private setCursorPosition(event: SafeAny): void {
        const rawValueWithoutSuffixEndPosition = this.inputService.getRawValueWithoutSuffixEndPosition();

        setTimeout(function () {
            event.target.setSelectionRange(rawValueWithoutSuffixEndPosition, rawValueWithoutSuffixEndPosition);
        }, 0);
    }
}
